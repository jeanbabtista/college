const crypto = require('crypto')
const CryptoJS = require('crypto-js')

const clients = new Map()
const sender = crypto.createECDH('secp521r1')
const serverKey = sender.generateKeys()

const getSecret = (clientUrl) => sender.computeSecret(clients.get(clientUrl)).toString('hex')
const encrypt = (buffer, key) => CryptoJS.AES.encrypt(buffer.toString('base64'), key).toString()
const decrypt = (base64EncryptedBuffer, key) => CryptoJS.AES.decrypt(base64EncryptedBuffer, key).toString(CryptoJS.enc.Utf8)

module.exports = { sender, serverKey, clients, getSecret, encrypt, decrypt }
