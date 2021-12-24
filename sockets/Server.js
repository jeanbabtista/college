import WebSocket, { WebSocketServer } from 'ws'
import { exit } from 'process'

// parse arguments
if (process.argv.length < 3) {
  console.log('Format must be: node index.js <server port> [[peer 1 port] peer 2 port] ...')
  exit(-1)
}

export const port = process.argv[2]
const peers = process.argv.slice(3).map((peer) => `ws://localhost:${peer}`)

class Server {
  constructor(blockchain) {
    this.blockchain = blockchain
    this.sockets = []
    this.listen(port)
  }

  handleSocket = (socket) => {
    this.sockets.push(socket)
    console.log('[ Client connected ]')
  }

  handlePeerConnection = () => {
    peers.forEach((peer) => {
      const socket = new WebSocket(peer)
      socket.on('peer-connect', () => this.handleSocket(socket))
    })
  }

  listen = (port) => {
    const server = new WebSocketServer({ port })
    server.on('connection', this.handleSocket)
    this.handlePeerConnection()
  }
}

export default Server
