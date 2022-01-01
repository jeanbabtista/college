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
    this.difficulty = 4
    this.#generator = id()
    this.interval = setInterval(this.handleSync, blockGenerationInterval * 1000)
    this.chain = [new Block(0, 'Genesis', this.difficulty, '0')]
  }

  getIndex = () => this.#generator.next().value
  getLastBlock = () => this.chain[this.chain.length - 1]

  addBlock = async (data) =>
    new Promise((resolve, reject) => {
      const block = new Block(this.getLastBlock().index + 1, 'block', this.difficulty, this.getLastBlock().hash)

      if ((Date.now() - this.timestamp) / 1000 > 60 || (block.timestamp - this.getLastBlock().timestamp) / 1000 > 60) {
        clearInterval(this.interval)
        reject(`Error: block's time badges are invalid`)
      }

      block.mine().then(() => {
        this.chain.push(block)
        resolve()
      })
    })

  isValid = () => {
    for (let i = 1; i < this.chain.length; i++) {
      const currBlock = this.chain[i]
      const prevBlock = this.chain[i - 1]

      if (currBlock.index !== prevBlock.index + 1 || currBlock.previousHash !== prevBlock.hash || currBlock.hash !== currBlock.computeHash())
        return false
    }

    return true
  }

  trySetChain = (chain) => {
    const calculateCumulativeDifficulty = (chain) => chain.reduce((acc, block) => acc + 2 ** block.difficulty, 0)

    const thisDiff = calculateCumulativeDifficulty(this.chain)
    const otherDiff = calculateCumulativeDifficulty(chain)

    if (thisDiff < otherDiff)
      this.chain = chain.map((block) => {
        const b = new Block(block.index, block.data, block.difficulty, block.previousHash)
        b.hash = block.hash
        b.nonce = block.nonce
        b.hash = block.hash

        return b
      })
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
    console.log('\nChain:', this.chain)
  }
}

export default Blockchain
