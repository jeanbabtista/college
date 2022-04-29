const { model, Schema } = require('mongoose')

const schema = new Schema({
  description: String,
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  answerId: {
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }
})

module.exports = model('Comment', schema)
