import Blockchain from './models/Blockchain.js'
const blockchain = new Blockchain()

blockchain.addBlock('2nd block')
blockchain.addBlock('3rd block')

blockchain.print()
