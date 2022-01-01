import crypto from 'crypto'

class Block {
  constructor(index, data, difficulty, previousHash) {
    this.index = index
    this.difficulty = difficulty
    this.previousHash = previousHash
    this.hash = '0'
    this.nonce = 0
    this.data = data
    this.timestamp = Date.now()
  }

  computeHash = () =>
    crypto.createHash('sha256').update(`${this.index}${this.timestamp}${this.data}${this.previousHash}${this.nonce}${this.difficulty}`).digest('hex')

  isValidHash = () => this.hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join('0')

  /* brute-force POW algorithm to mine blocks */
  mine = async () =>
    new Promise((resolve) =>
      setImmediate(() => {
        while (!this.isValidHash()) {
          this.nonce++
          this.hash = this.computeHash()
        }

        resolve()
      }),
    )
}

export default Block
