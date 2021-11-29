const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

// middleware
app.use(cors())

// config
require('dotenv').config()
const { PORT, REACT_PORT, CHAT } = process.env
const url = `http://localhost:${PORT}`
const origin = `http://localhost:${REACT_PORT}`

// socket io
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: origin, methods: ['GET', 'POST'] },
})

const users = new Map()

const getMsg = (message, user = 'Strežnik') => ({ user, message })

const getUserSocket = (name) => {
  for (const [socket, user] of users) if (user === name) return socket
  return undefined
}

const sendMessage = (message, socket) => socket.emit('receive', message)

const broadcast = (message) => {
  console.log(message)
  for (const [_socket, _user] of users) sendMessage(message, _socket)
}

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    // add user
    users.set(socket, user)

    // broadcast
    const message = getMsg(`Uporabnik ${user} se je povezal.`)
    broadcast(message)
  })

  socket.on('send', (message) => {
    console.log(message)
    for (const [_socket, _user] of users) if (socket !== _socket) _socket.emit('receive', message)
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
