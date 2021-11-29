const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const CryptoJS = require('crypto-js')

// middleware
app.use(cors())

// config
require('dotenv').config()
const { PORT, REACT_PORT } = process.env
const url = `http://localhost:${PORT}`
const origin = `http://localhost:${REACT_PORT}`

// socket io
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: origin, methods: ['GET', 'POST'] },
})

const users = new Map()

const getMsg = (message, user = 'Strežnik') => ({ user, message })

const encrypt = (message, key = 'ključ123') => CryptoJS.AES.encrypt(message, key).toString()
const decrypt = (message, key = 'ključ123') => CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8)

const getUserSocket = (name) => {
  for (const [socket, user] of users) if (user === name) return socket
  return undefined
}

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

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    // add user
    const user = decrypt(data)
    users.set(socket, user)

    // broadcast
    const message = getMsg(`Uporabnik ${user} se je povezal.`)
    broadcast(message)
  })

  socket.on('send', ({ user, message }) => {
    const data = { user, message: decrypt(message) }
    broadcast(data, socket)
  })

  socket.on('leave', (user) => {
    // remove user
    users.delete(getUserSocket(user))

    // broadcast
    const message = getMsg(`Uporabnik ${user} se je odklopil.`)
    broadcast(message)
  })

  socket.on('connect-error', (e) => console.log(e))
  socket.on('error', (e) => console.log(e))
})

// server
server.listen(PORT, () => console.log(url))
