const { model, Schema } = require('mongoose')

const schema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  tag: {
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }
})

module.exports = model('QuestionTag', schema)
