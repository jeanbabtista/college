import Block from './Block.js'

function* id() {
  let index = 1
  while (true) yield index++
}

const blockGenerationInterval = 10 // new block will generate every 10 seconds
const difficultyAdjustInterval = 10 // difficulty will adjust every 10 blocks

class Blockchain {
  constructor() {
    this.chain = [new Block(0, 'Genesis block')]
    this.difficulty = 4
    this.generator = id()
    setInterval(this.handleSync, blockGenerationInterval * 1000)
  }

  get index() {
    return this.generator.next().value
  }

  get length() {
    return this.chain.length
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1]
  }

  handleSync = () => {
    if (this.length <= difficultyAdjustInterval) return

    const prevAdjustBlock = this.chain[this.length - difficultyAdjustInterval]
    const timeExpected = blockGenerationInterval * difficultyAdjustInterval
    const timeTaken = (this.lastBlock.timestamp - prevAdjustBlock.timestamp) / 1000

    if (timeTaken < timeExpected / 2) this.difficulty = prevAdjustBlock.difficulty + 1
    else if (timeTaken > timeExpected / 2) this.difficulty = prevAdjustBlock.difficulty - 1
    else this.difficulty = prevAdjustBlock.difficulty

    console.log('\nDifficulty updated to', this.difficulty)
  }

  addBlock = (data) =>
    new Promise((resolve) => {
      const block = new Block(this.index, data, this.difficulty, this.lastBlock.hash)
      block.mine(this.difficulty).then(() => {
        this.chain.push(block)
        block.print()
        resolve()
      })

      console.log(`Chain is ${this.isValid() ? '' : 'in'}valid.`)
    })

  addNode = (node) => this.nodes.push(node)

  print = () => {
    for (const block of this.chain) block.print()
  }

  isValid = () => {
    for (let i = 1; i < this.length; i++) {
      const currBlock = this.chain[i]
      const prevBlock = this.chain[i - 1]

      if (
        currBlock.index !== prevBlock.index + 1 ||
        currBlock.previousHash !== prevBlock.hash ||
        currBlock.hash !== currBlock.computeHash(this.difficulty)
      )
        return false
    }

    return true
  }
}

export default Blockchain
