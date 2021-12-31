import express from 'express'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'

// constants
import actions from './actions.js'
import Block from '../models/Block.js'

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
// app.use(morgan('dev'))

class Server {
  constructor(port, blockchain) {
    this.blockchain = blockchain
    this.port = port
    this.url = `http://localhost:${port}`
    this.nodes = new Map()
    this.listen()
  }

  addNode = (port, clientSocket) => this.nodes.set(port, clientSocket)
  getNodes = () =>
    Array.from(this.nodes, ([port, clientSocket]) => ({ port, url: clientSocket.io.uri }))

  message = (message) => console.log(`[ Server|${this.port} ]: ${message}`)

  startMining = async () => {
    while (true) {
      await this.blockchain.addBlock('block')
      io.sockets.emit('send-chain', this.blockchain.chain)
    }
  }

  /* stopMining = async () =>
    setImmediate(() => {
      this.isMining = false
      clearInterval(this.blockchain.interval)
    }) */

  listen = () => io.on('connection', (socket) => socket.emit(actions.JOIN_SERVER))
}

export default Server
