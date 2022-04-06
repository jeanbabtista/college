const { Schema, model } = require('mongoose')

const TagSchema = new Schema({
  title: String,
})

module.exports = model('Tag', TagSchema)
