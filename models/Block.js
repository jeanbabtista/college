class Block {
  constructor(index, data, prevHash) {
    this.index = index
    this.data = data
    this.prevHash = prevHash
  }

  print() {
    console.log(`[Block #${this.index}]: ${this.data.toString()}`)
  }
}

export default Block
