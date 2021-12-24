import Blockchain from './models/Blockchain.js'
const blockchain = new Blockchain()

const mine = async () => {
  let i = 0
  while (i < 50) {
    await blockchain.addBlock('block')
    i++
  }
}

mine()
