import express from 'express'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import cors from 'cors'
import actions from './actions.js'

// config
export const app = express()
export const server = createServer(app)
const io = new SocketServer(server)

// middleware
app.use(express.json())
app.use(cors())

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
    Array.from(this.nodes, ([port, clientSocket]) => ({ port, url: clientSocket.url }))

  message = (message) => console.log(`[ Server|${this.port} ]: ${message}`)

  listen = () =>
    io.on('connection', (socket) => {
      socket.emit(actions.JOIN_SERVER)
    })
}

export default Server
