import express from 'express'
import http from 'http'
import fs from 'fs/promises'
import cors from 'cors'
import { Server } from 'socket.io'
import CryptoJS from 'crypto-js'
const app = express()

// middleware
app.use(cors())

// config
const url = `http://localhost:5000`
const origin = `http://localhost:3000`
const PORT = 5000
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
