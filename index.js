const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const fs = require('fs')
const path = require('path')
const CryptoJS = require('crypto-js')
const cors = require('cors')

// middleware
app.use(cors())

// helpers
const parse = require('./helpers/args.js')
const upload = require('./helpers/multer.js')
const getUrl = require('./helpers/url.js')

// variables config
const [portServer, portClient] = parse()
const urlServer = getUrl(portServer)
const urlClient = getUrl(portClient)
const dir = `files-${portServer}`

// save public keys
const clients = new Map()
const { sender, key, encrypt, decrypt } = require('./helpers/crypto.js')

// making server directory
try {
  fs.mkdirSync(dir)
  console.log(`Created directory '${dir}'.`)
} catch (e) {
  console.log(`Directory '${dir}' already exists.`)
}

// socket io config
const socketServer = new (require('socket.io').Server)(server)
const socketClient = require('socket.io-client')(urlClient)
console.log('Server:', urlServer)

socketServer.on('connection', (socket) => {
  socket.emit('join', key)
  console.log('Public key sent.')
})

// client logic
socketClient.on('join', (key) => {
  clients.set(urlClient, key.toString('hex'))
  console.log('Public key received.')
})

socketClient.on('send_to_client', ({ urlFrom, name, buffer }) => {
  console.log('Received data from', urlFrom)

  /* const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(buffer),
  }) */

  const data = buffer.toString()

  const decrypted = decrypt(data, key)
  console.log('buffer decrypted:', decrypted)

  return
  // save file
  const p = path.join(dir, name)
  fs.writeFileSync(p, decrypted)
})

app.get('/', (req, res) => {
  console.log(clients)
  res.json({ message: 'Hello!' })
})

app.post('/upload', upload(dir).single('file'), (req, res) => {
  const { file } = req
  const { urlFrom, urlTo } = req.body

  if (!file) return

  try {
    console.log('Sending data to', urlTo)

    // convert file to stream buffer
    const p = path.join(dir, file.originalname)
    const buffer = fs.readFileSync(p, 'base64')

    // encrypt data
    const secret = sender.computeSecret(key).toString('hex')
    const encrypted = encrypt(buffer, secret)

    socketServer.sockets.emit('send_to_client', {
      urlFrom,
      name: file.originalname,
      buffer: encrypted,
    })
  } catch (e) {
    console.log('Send error:', e.message)
  }
})

server.listen(portServer)
