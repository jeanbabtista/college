import SHA256 from 'crypto-js/sha256.js'

class Block {
  constructor(index, data, previousHash) {
    this.index = index
    this.data = data
    this.timestamp = Date.now()
    this.hash = this.calculateHash()
    this.previousHash = previousHash
  }

  calculateHash(nonce = 0, difficulty = 0) {
    return SHA256(
      this.index +
        this.timestamp +
        this.data +
        this.previousHash +
        nonce +
        difficulty
    ).toString()
  }

  isValidHash(hash, difficulty) {
    return hash.substring(0, difficulty) === Array(difficulty + 1).join('0')
  }

  isValidProof(nonce) {
    const guessHash = this.calculateHash(nonce)
    return guessHash === this.hash
  }

  mine(difficulty) /* POW */ {
    let nonce = 0

    while (true) {
      const hash = this.calculateHash(nonce, difficulty)
      if (this.isValidHash(hash, difficulty)) break
      nonce++
    }
  }

  print() {
    console.log(`[Block #${this.index}]: ${this.data}`)
  }
}

export default Block
