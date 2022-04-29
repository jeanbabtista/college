const { model, Schema, Types } = require('mongoose')
const { hash } = require('bcrypt')

const schema = new Schema({
  username: String,
  email: String,
  password: String,
  imagePath: String
})

schema.pre('save', function (next) {
  hash(this.password, 10, (e, hash) => {
    if (e) return next(e)
    this.password = hash
    next()
  })
})

module.exports = model('User', schema)
