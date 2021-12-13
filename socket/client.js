const fs = require('fs')
const path = require('path')

// helpers
const { parse, getUrl, getDir } = require('../helpers/init')
const { sender, clients, decrypt } = require('../helpers/crypto.js')

// config
const [portServer, portClient] = parse()
const urlClient = getUrl(portClient)
const dir = getDir(portServer)

// export
const onJoinServer = (key) => {
  clients.set(urlClient, key)
  console.log('Public key received.')
}

const onReceiveFromServer = ({ urlFrom, name, base64EncryptedBuffer }) => {
  console.log('Received data [', 'from', urlFrom, ']')
  fs.writeFileSync(path.join(dir, `encrypted-${name}`), base64EncryptedBuffer)

  // decrypt
  try {
    const key = clients.get(urlFrom)
    const secret = sender.computeSecret(key).toString('hex')

    const decrypted = decrypt(base64EncryptedBuffer, secret)
    const decoded = Buffer.from(decrypted, 'base64')
    fs.writeFileSync(path.join(dir, name), decoded)

    // console.log('secret:', secret)
    // console.log('decrypted:', decrypted)
    // console.log('original:', received)
  } catch (e) {
    console.log(`socketClient.on('send_to_client') error: ${e.message}`)
  }
}

module.exports = {
  onJoinServer,
  onReceiveFromServer,
}
