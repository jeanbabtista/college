// models
import Blockchain from './models/Blockchain.js'
import Server, { app, server } from './sockets/Server.js'
import Client from './sockets/Client.js'
import { exit } from 'process'

// constants
import actions from './sockets/actions.js'

// parse arguments
if (process.argv.length !== 3) {
  console.info('Format must be: node index.js <port>')
  exit(-1)
}

// config
const port = process.argv[2]
const serverSocket = new Server(port, new Blockchain())
serverSocket.message(serverSocket.url)

// helpers
const getResponse = (error, message) => ({ error, message })

// routes
app.post('/nodes/add', (req, res) => {
  const { port } = req.body
  const node = new Client(port)

  node.socket.on(actions.JOIN_SERVER, () => {
    if (!node.socket.connected) return res.json(getResponse(true, 'Cannot connect to the client'))
    node.message('Connected.')
  })

  node.socket.on('try-set-chain', async (chain) => {
    try {
      await serverSocket.blockchain.trySetChain(chain)
    } catch (e) {
      console.log(e.message)
    }
  })

  serverSocket.addNode(port, node.socket)
  res.json(getResponse(null, `Successfully added node to peer`))
})

app.post('/mining/start', (_req, res) => {
  serverSocket.startMining()
  serverSocket.message('Mining started.')
  res.json(getResponse(null, `Mining started on port ${port}`))
})

server.listen(port)
