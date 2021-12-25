import { io } from 'socket.io-client'

class Client {
  constructor(port) {
    this.port = port
    this.url = `http://localhost:${port}`
    this.socket = io(this.url)
  }

  message = (message) => console.log(`[ Client|${this.port} ]: ${message}`)
}

export default Client
