import Block from './Block.js'

function* id() {
  let index = 1
  while (true) yield index++
}

class Blockchain {
  #generator

  constructor() {
    this.blockGenerationInterval = 10 // new block will generate every 10 seconds
    this.difficultyAdjustInterval = 10 // difficulty will adjust every 10 blocks
    this.difficulty = 4
    this.#generator = id()
    this.chain = [new Block(0, 'Genesis', this.difficulty, '0')]
  }

  getIndex = () => this.#generator.next().value
  getLastBlock = () => this.chain[this.chain.length - 1]

  lastValidIndex = () => {
    let i = 1

    for (; i < this.chain.length; i++) {
      const currBlock = this.chain[i]
      const prevBlock = this.chain[i - 1]

      if (currBlock.index !== prevBlock.index + 1 || currBlock.previousHash !== prevBlock.hash || currBlock.hash !== currBlock.computeHash())
        return i - 1 // return previous index
    }

    return i - 1 // return last index
  }

  tryAddBlock = async (data) =>
    new Promise((resolve, reject) => {
      // mine from last valid index
      const i = this.lastValidIndex()
      this.chain = this.chain.slice(0, i + 1)
      const block = new Block(i + 1, 'block', this.difficulty, this.getLastBlock().hash)

      if ((Date.now() - this.timestamp) / 1000 > 60 || (block.timestamp - this.getLastBlock().timestamp) / 1000 > 60)
        reject(`Error: block time badges are invalid`)

      block.mine().then(() => {
        this.chain.push(block)
        resolve()
      })
    })

  trySetChain = async (chain) =>
    new Promise((resolve) => {
      const calculateCumulativeDifficulty = (chain) => chain.reduce((acc, block) => acc + 2 ** block.difficulty, 0)

      const thisDiff = calculateCumulativeDifficulty(this.chain)
      const otherDiff = calculateCumulativeDifficulty(chain)

      if (thisDiff < otherDiff)
        this.chain = chain.map((block) => {
          const b = new Block(block.index, block.data, block.difficulty, block.previousHash)
          b.hash = block.hash
          b.nonce = block.nonce
          b.timestamp = block.timestamp

          return b
        })

      resolve()
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

  handleSync = () => {
    if (this.chain.length <= this.difficultyAdjustInterval) return

    const prevAdjustBlock = this.chain[this.chain.length - this.difficultyAdjustInterval]
    const timeExpected = this.blockGenerationInterval * this.difficultyAdjustInterval
    const timeTaken = (this.getLastBlock().timestamp - prevAdjustBlock.timestamp) / 1000

    this.difficulty =
      timeTaken < timeExpected / 2
        ? prevAdjustBlock.difficulty + 1
        : timeTaken > timeExpected / 2
        ? prevAdjustBlock.difficulty - 1
        : prevAdjustBlock.difficulty
  }
}

export default Blockchain
