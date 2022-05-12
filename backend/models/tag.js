const { model, Schema } = require('mongoose')

const schema = new Schema({
  title: String,
})

module.exports = model('Tag', schema)