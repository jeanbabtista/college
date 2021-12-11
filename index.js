const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
const { exit } = require('process')
const multer = require('multer')

const init = () => {
  const port = parseInt(process.argv[2])
  const mode = process.argv[3]
  const serverPort = mode == 'c' ? parseInt(process.argv[4]) : null

  const dir = `files/files-${port}`
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir, (e) => console.log('Error:', e.message))

  return [port, dir, mode, serverPort]
}

// middleware
app.use(cors())

// config
const [port, dir, mode, serverPort] = init()
const url = `http://localhost:${port}`
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
})

switch (mode) {
  case 's': {
    const http = require('http')
    const { Server } = require('socket.io')
    const socket = http.createServer(app)
    const io = new Server(socket)

    io.on('connection', (socket) => {
      console.log('A client connected!')
      socket.emit('join_server', 'Hello from server!')
    })

    socket.listen(port, () => console.log(url))
    break
  }
  case 'c': {
    const io = require('socket.io-client')
    const socket = io.connect(`http://localhost:${serverPort}`)

    socket.on('join_server', (data) => {
      console.log('Server:', data)
    })

    break
  }
  default:
    console.log('Invalid mode.')
}

// routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' })
})

app.post('/upload', upload.single('file'), (req, res) => {
  const { file } = req
  console.log('file received:', file)
  res.status(200).json({ file })
})

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
server.listen(port, () => console.log(url)) */
