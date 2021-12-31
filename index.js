// models
import Block from './models/Block.js'
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

// helpers
console.log('[ CONFIG ]')
console.log('# URL:', serverSocket.url)
const getResponse = (error, message) => ({ error, message })

// routes
app.get('/chain', (_req, res) => res.json(serverSocket.blockchain.chain))
app.get('/nodes', (_req, res) => res.json(serverSocket.getNodes()))

app.post('/nodes/add', (req, res) => {
  const { port } = req.body
  const node = new Client(port)

  node.socket.on(actions.JOIN_SERVER, () => {
    if (!node.socket.connected) return res.json(getResponse(true, 'Cannot connect to the client'))

    node.message('Connected.')
    res.json(getResponse(null, `Successfully added node to peer`))
  })

  serverSocket.addNode(port, node.socket)
})

app.post('/start_mining', (_req, res) => {
  serverSocket.startMining()
  console.log('# Mining started.')
  res.json(getResponse(null, `Mining started on port ${port}`))
})

app.post('/stop_mining', (_req, res) => {
  serverSocket.stopMining()
  console.log('# Mining stopped.')
  res.json(getResponse(null, `Mining stopped on port ${port}`))
})

server.listen(port)
