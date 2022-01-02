import express from 'express'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'

// constants
import actions from './actions.js'

// config
export const app = express()
export const server = createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// middleware
app.use(express.json())
app.use(cors())

class Server {
  constructor(port, blockchain) {
    this.blockchain = blockchain
    this.nodes = new Map()
    this.port = port
    this.url = `http://localhost:${port}`
    this.listen()
  }

  addNode = (port, clientSocket) => this.nodes.set(port, clientSocket)
  message = (message) => console.log(`[ Server|${this.port} ]: ${message}`)
  listen = () => io.on('connection', (socket) => socket.emit(actions.JOIN_SERVER))

  startMining = async () => {
    this.interval = setInterval(this.handleSync, this.blockchain.blockGenerationInterval * 1000)

    while (true) {
      try {
        await this.blockchain.tryAddBlock('block')
        io.sockets.emit('send-chain', this.blockchain.chain)
      } catch (e) {
        console.log(e)
        clearInterval(this.interval)
        break
      }
    }
  }

  handleSync = () => {
    this.blockchain.handleSync()

    console.log('\nDifficulty updated to', this.blockchain.difficulty)
    console.log(`Chain is ${this.blockchain.isValid() ? '' : 'in'}valid`)
    // console.log('Last valid index:', this.blockchain.lastValidIndex())

    // adjust chain
    io.sockets.emit('try-set-chain', this.blockchain.chain)
  }
}

export default Server
