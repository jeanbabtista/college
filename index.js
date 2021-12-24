import express from 'express'
// import { createServer } from 'http'
// import { Server } from 'socket.io'
// import ioClient from 'socket.io-client'

// models
import Block from './models/Block.js'
import Blockchain from './models/Blockchain.js'
import Server, { port } from './sockets/Server.js'
// import createSocket from './sockets/index.js'

// config
const app = express()
// const server = createServer(app)
// const ioServer = new Server(server)
const blockchain = new Blockchain()
const server = new Server(blockchain)

// variables
const httpPort = port - 1000
const url = `http://localhost:${httpPort}`
blockchain.addNode(url, 'socket node')

// middleware
app.use(express.json())

// routes
app.get('/chain', (_req, res) => res.json(blockchain.chain))

app.post('/add_node', (req, res) => {
  const { port } = req.body
  const url = `http://localhost:${port}`

  blockchain.addNode(url, 'socket node')
  res.json({ error: null, message: 'Successfully added node.' })
})

app.post('/mine', async (req, res) => {
  try {
    await blockchain.addBlock(new Block({ from: 'zan', to: 'mafija', amount: 100 }))
    res.json({ error: false, message: 'Successfully added new block to the blockchain.' })
  } catch (e) {
    res.json({ error: true, message: e.message })
  }
})

const mine = async () => {
  let i = 0
  while (i < 50) {
    await blockchain.addBlock(new Block({ from: 'zan', to: 'mafija', amount: 100 }))
    i++
  }
}

// mine()

app.listen(httpPort, () => console.log(`${url}/chain`))
