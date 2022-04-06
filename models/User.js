const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  imagePath: String,
})

module.exports = model('User', UserSchema)
