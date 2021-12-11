const express = require('express')
const app = express()
const multer = require('multer')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const CryptoJS = require('crypto-js')

// middleware
app.use(cors())

// config
const PORT = 5000
const REACT_PORT = 3000
const url = `http://localhost:${PORT}`
const origin = `http://localhost:${REACT_PORT}`
const files = []

// multer config
const dest = './files'
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file, cb) => cb(null, file.originalname),
})

const fileUpload = multer({ storage })

// routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!', files })
})

app.post('/upload', fileUpload.single('file'), (req, res) => {
  const { file } = req
  files.push(file)
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))

/* // socket io
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: origin, methods: ['GET', 'POST'] },
})

// helpers
const getMsg = (message, user = 'Strežnik') => ({ user, message })
const encrypt = (message, key = 'ključ123') =>
  CryptoJS.AES.encrypt(message, key).toString()
const decrypt = (message, key = 'ključ123') =>
  CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8)
const sendMessage = (message, socket) => socket.emit('receive', message)
const broadcast = ({ user, message }, socket = null) => {
  const data = { user, message: encrypt(message) }

  // send to server
  console.log(data)

  // send to all clients
  if (!socket) for (const [_socket, _user] of users) sendMessage(data, _socket)
  // do not send to the current client
  else
    for (const [_socket, _user] of users)
      if (socket !== _socket) sendMessage(data, _socket)
}

// users
const users = new Map()

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    // add user
    const user = decrypt(data)
    users.set(socket, { name: user })

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
server.listen(PORT, () => console.log(url)) */
