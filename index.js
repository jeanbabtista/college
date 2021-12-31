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
    res.json(getResponse(null, `Successfully added node to peer`))
  })

  node.socket.on('try-set-chain', (data) => {
    console.log('trying to set chain from port', data.port)
    serverSocket.blockchain.trySetChain(data.chain)

    console.log('received chain:', data.chain)
    console.log('new chain:', serverSocket.blockchain.chain)
  })

  serverSocket.addNode(port, node.socket)
})

app.post('/start_mining', (_req, res) => {
  serverSocket.startMining()
  serverSocket.message('Mining started.')
  res.json(getResponse(null, `Mining started on port ${port}`))
})

app.post('/test_send_chain', (req, res) => {
  const port = parseInt(req.body.port)
  const clientSocket = serverSocket.nodes.get(port)

  if (!clientSocket) return res.json(getResponse(true, 'Specified client is not connected'))

  console.log('sending chain to client', clientSocket.io.uri)
  serverSocket.sendChain(port)

  res.json(getResponse(null, 'Successfully sent chain to client'))
})

server.listen(port)
