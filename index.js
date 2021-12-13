const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const fs = require('fs')
const path = require('path')
const cors = require('cors')

// middleware
app.use(cors())

// helpers
const { parse, mkdir, getUrl, getDir, handleError } = require('./helpers/init.js')
const upload = require('./helpers/multer.js')
const { getSecret, encrypt } = require('./helpers/crypto.js')

// variables config
const [portServer, portClient] = parse()
const urlServer = getUrl(portServer)
const urlClient = getUrl(portClient)
const dir = getDir(portServer)
mkdir(dir)

// socket io config
const socketServer = new (require('socket.io').Server)(server)
const socketClient = require('socket.io-client')(urlClient)
const { emitJoinServer, emitSendToClient } = require('./socket/server.js')(socketServer)
const { onJoinServer, onReceiveFromServer } = require('./socket/client.js')

// server
const onConnection = (socket) => socket.emit('join', emitJoinServer())
socketServer.on('connection', onConnection)

// client
socketClient.on('join', onJoinServer)
socketClient.on('send_to_client', onReceiveFromServer)

app.post('/upload', upload(dir).single('file'), (req, res) => {
  const { file } = req
  if (!file) return

  const { urlFrom, urlTo } = req.body
  console.log('Sending data [', 'to', urlTo, ']')

  try {
    // encrypt
    const buffer = fs.readFileSync(path.join(dir, file.originalname))
    const secret = getSecret(urlTo)
    const encrypted = encrypt(buffer, secret)

    emitSendToClient({ urlFrom, name: file.originalname, base64EncryptedBuffer: encrypted })

    return {
      error: false,
      message: 'Successfully transfered file to the server.',
    }
  } catch (e) {
    handleError('socketServer.emit(send_to_client) error', e)

    return {
      error: true,
      message: `Error occured: ${e.message}`,
    }
  }
})

server.listen(portServer, () => console.log('Server:', urlServer))
