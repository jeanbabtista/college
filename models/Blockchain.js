import Block from './Block.js'

class Blockchain {
  constructor() {
    this.chain = [new Block(0, '1st block', '0')]
    this.difficulty = 4
  }

  get lastBlock() {
    if (!this.chain.length) return undefined
    return this.chain.slice(-1)
  }

  addBlock(data) {
    this.chain.push(new Block(this.chain.length, data, this.lastBlock.hash))
  }

  print() {
    for (const block of this.chain) block.print()
  }

  isValid() {
    this.chain.forEach((block, i) => {
      const previousBlock = this.chain[i - 1]
      if (
        block.index === previousBlock.index + 1 &&
        block.previousHash === previousBlock.hash &&
        block.hash === block.calculateHash()
      )
        return true
      return false
    })
  }
}

export default Blockchain
