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
    this.chain = [new Block(0, 'Genesis', this.difficulty, '0')]
    this.difficulty = 5
    this.#generator = id()
    this.interval = setInterval(this.handleSync, blockGenerationInterval * 1000)
  }

  getIndex = () => this.#generator.next().value
  getLastBlock = () => this.chain[this.chain.length - 1]

  addBlock = async (data) =>
    new Promise((resolve) => {
      const block = new Block(this.getIndex(), 'block', this.difficulty, this.getLastBlock().hash)
      block.mine(this.difficulty).then(() => {
        this.chain.push(block)

        // block.print()
        // console.log(`Chain is ${this.isValid() ? '' : 'in'}valid.`)

        console.log(block.index, '. Block mined')
        resolve()
      })
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
        currBlock.hash !== currBlock.computeHash()
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
