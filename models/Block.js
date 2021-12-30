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
    crypto
      .createHash('sha256')
      .update(
        `${this.index}${this.timestamp}${this.data}${this.previousHash}${this.nonce}${this.difficulty}`
      )
      .digest('hex')

  isValidHash = () =>
    this.hash.substring(0, this.difficulty) === Array(this.difficulty + 1).join('0')

  /* brute-force POW algorithm to mine blocks */
  mine = async () =>
    new Promise((resolve) =>
      setImmediate(() => {
        while (!this.isValidHash(this.difficulty)) {
          this.nonce++
          this.hash = this.computeHash(this.difficulty)
        }

        resolve('New block mined.')
      })
    )

  print = () => {
    const substringPosition = 10

    console.log('\t↑')
    console.log(`[ Block #${this.index} ]`)
    console.log(
      'prev:',
      this.previousHash === '0' ? '\t0' : this.previousHash.substring(0, substringPosition)
    )
    console.log('data:', this.data)
    console.log('timestamp:', this.timestamp)
    console.log('hash:', this.hash.substring(0, substringPosition))
  }
}

export default Block
