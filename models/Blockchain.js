import Block from './Block.js'

function* id() {
  let index = 1
  while (true) yield index++
}

const blockGenerationInterval = 10 // new block will generate every 10 seconds
const difficultyAdjustInterval = 10 // difficulty will adjust every 10 blocks

class Blockchain {
  #generator

  constructor() {
    this.chain = [new Block()]
    this.nodes = new Map()
    this.difficulty = 4
    this.#generator = id()

    setInterval(this.handleSync, blockGenerationInterval * 1000)
  }

  getIndex = () => this.#generator.next().value
  getLastBlock = () => this.chain[this.chain.length - 1]

  addNode = (url, socket) => this.nodes.set(url, socket)

  addBlock = async (block) =>
    new Promise((resolve) => {
      block.setIndex(this.getIndex())
      block.setDifficulty(this.difficulty)
      block.setPreviousHash(this.getLastBlock().hash)
      block.mine(this.difficulty)

      this.chain.push(block)
      block.print()
      console.log(`Chain is ${this.isValid() ? '' : 'in'}valid.`)

      resolve()
    })

  print = () => {
    for (const block of this.chain) block.print()
  }

  isValid = () => {
    for (let i = 1; i < this.chain.length; i++) {
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

  trySetChain = (chain) => {
    const calculateCumulativeDifficulty = (chain) =>
      chain.reduce((acc, block) => acc + 2 ** block.getDifficulty(), 0)

    const thisDiff = calculateCumulativeDifficulty(this.chain)
    const otherDiff = calculateCumulativeDifficulty(chain)

    if (thisDiff < otherDiff) this.chain = chain
  }

  handleSync = () => {
    if (this.chain.length <= difficultyAdjustInterval) return

    const prevAdjustBlock = this.chain[this.chain.length - difficultyAdjustInterval]
    const timeExpected = blockGenerationInterval * difficultyAdjustInterval
    const timeTaken = (this.getLastBlock().timestamp - prevAdjustBlock.timestamp) / 1000

    this.difficulty =
      timeTaken < timeExpected / 2
        ? prevAdjustBlock.difficulty + 1
        : timeTaken > timeExpected / 2
        ? prevAdjustBlock.difficulty - 1
        : prevAdjustBlock.difficulty

    console.log('\nDifficulty updated to', this.difficulty)
  }
}

export default Blockchain
