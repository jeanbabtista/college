import Blockchain from './models/Blockchain.js'
const blockchain = new Blockchain()

const mine = async () => {
  while (true) await blockchain.addBlock('block')
}

mine()
