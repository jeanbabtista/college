import Block from './models/Block.js'

const data = {
  name: 'Zan',
  message: 'Hello World!',
  toString() {
    return `${this.name}, ${this.message}`
  },
}

const b = new Block(0, data, null)

b.print()
