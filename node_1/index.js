const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const CryptoJS = require('crypto-js')

// middleware
app.use(cors())

// config
const PORT = 5000
const REACT_PORT = 5000
const url = `http://localhost:${PORT}`
const origin = `http://localhost:${REACT_PORT}`

// socket io
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: origin, methods: ['GET', 'POST'] },
})

// helpers
const getMsg = (message, user = 'Strežnik') => ({ user, message })
const encrypt = (message, key = 'ključ123') => CryptoJS.AES.encrypt(message, key).toString()
const decrypt = (message, key = 'ključ123') => CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8)
const sendMessage = (message, socket) => socket.emit('receive', message)
const broadcast = ({ user, message }, socket = null) => {
  const data = { user, message: encrypt(message) }

  // send to server
  console.log(data)

  // send to all clients
  if (!socket) for (const [_socket, _user] of users) sendMessage(data, _socket)
  // do not send to the current client
  else for (const [_socket, _user] of users) if (socket !== _socket) sendMessage(data, _socket)
}

// users
const users = new Map()
const words = ['omrežje', 'wifi', 'usmerjevalnik', 'zvezdišče', 'ethernet']
let word = ''
let guess = ''
let game = false

const getUserScore = (key) => users.get(key).score
const incUserScore = (key) => users.set(key, { ...users.get(key), score: users.get(key).score + 1 })
const getGuessWord = () => {
  if (word) return guess
  word = words[Math.floor(Math.random() * words.length)]
  for (let i = 0; i < word.length; i++) guess += i % 2 == 0 ? word[i] : '_'
  return guess
}

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    // add user
    const user = decrypt(data)
    users.set(socket, { name: user, score: 0 })

    // broadcast
    const message = getMsg(`Uporabnik ${user} se je povezal.`)
    broadcast(message)
  })

  // received from client
  socket.on('send', ({ user, message }) => {
    const decrypted = decrypt(message)
    broadcast(getMsg(decrypted, user), socket)

    if (game) {
      // correct guess
      if (decrypted == word) {
        word = ''
        guess = ''
        incUserScore(socket)
        broadcast(getMsg(`Uporabnik ${user} je pravilo uganil besedo!`))
        broadcast(getMsg(`Ugani besedo: ${getGuessWord()}`))
      } else {
        broadcast(getMsg(`Napačna beseda. Poskusite znova.`))
        broadcast(getMsg(`Ugani besedo: ${getGuessWord()}`))
      }
    }

    if (decrypted === 'GAMESTART' && !game) {
      game = true
      broadcast(getMsg('Začenja se igra ugibanja besed. Začnite pisati!'))
      broadcast(getMsg(`Ugani besedo: ${getGuessWord()}`))
    }

    if (decrypted === 'GAMESTOP' && game) {
      game = false
      broadcast(getMsg(`Uporabnik ${user} je ustavil igro.`))

      data = 'Rezultati:'
      for (const [key, value] of users) data += value.name + ' - ' + value.score + ' točk '
      broadcast(getMsg(data))
    }
  })

  socket.on('leave', () => {
    const { name } = users.get(socket)

    // remove user
    users.delete(socket)

    // broadcast
    const message = getMsg(`Uporabnik ${name} se je odklopil.`)
    broadcast(message)

    // disconnect
    socket.disconnect()
  })

  socket.on('connect-error', (e) => console.log(e))
  socket.on('error', (e) => console.log(e))
  socket.on('disconnect', () => console.log('Disconnecting'))
})

// server
server.listen(PORT, () => console.log(url))
