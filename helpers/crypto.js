const crypto = require('crypto')
const CryptoJS = require('crypto-js')

const sender = crypto.createECDH('secp521r1')
const key = sender.generateKeys()

const encrypt = (buffer, key) => {
  return CryptoJS.AES.encrypt(buffer, key)
}

const decrypt = (buffer, key) => {
  return CryptoJS.AES.decrypt(buffer, key)
}

module.exports = { sender, key, encrypt, decrypt }
