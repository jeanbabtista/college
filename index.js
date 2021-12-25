// models
import Block from './models/Block.js'
import Blockchain from './models/Blockchain.js'
import Server, { app, server, io } from './sockets/Server.js'
import Client from './sockets/Client.js'
import { exit } from 'process'
import actions from './sockets/actions.js'

// parse arguments
if (process.argv.length !== 3) {
  console.info('Format must be: node index.js <port>')
  exit(-1)
}

// config
const port = process.argv[2]
const blockchain = new Blockchain()
const serverSocket = new Server(port, blockchain)

// helpers
const getResponse = (error, message) => ({ error, message })
console.log('[ CONFIG ]')
console.log('# URL:', `http://localhost:${port}/chain\n`)

const mine = async () => {
  let i = 0
  while (i < 50) {
    await blockchain.addBlock(new Block({ from: 'zan', to: 'mafija', amount: 100 }))
    i++
  }
}

// routes
app.get('/chain', (_req, res) => res.json(blockchain.chain))
app.get('/nodes', (_req, res) => res.json(serverSocket.getNodes()))

app.post('/nodes/add', (req, res) => {
  const { port } = req.body
  const node = new Client(port)

  node.socket.on(actions.JOIN_SERVER, () => {
    if (!node.socket.connected) return res.json(getResponse(true, 'Cannot connect to the client.'))

    node.message('Connected.')
    res.json(getResponse(null, `Successfully added node [ ${node.url} ]`))
  })

  serverSocket.addNode(port, node)
})

app.post('/mine', async (_req, res) => {
  try {
    await blockchain.addBlock(new Block({ from: 'zan', to: 'mafija', amount: 100 }))
    res.json({ error: false, message: 'Successfully added new block to the blockchain.' })
  } catch (e) {
    res.json({ error: true, message: e.message })
  }
})

server.listen(port)
