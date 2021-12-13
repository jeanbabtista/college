const { serverKey } = require('../helpers/crypto.js')

module.exports = (io) => {
  const emitJoinServer = () => {
    console.log('Public key sent.')
    return serverKey
  }

  const emitSendToClient = (payload) => io.sockets.emit('send_to_client', payload)

  return { emitJoinServer, emitSendToClient }
}
