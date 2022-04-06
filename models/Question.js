const { Schema, model } = require('mongoose')

const QuestionSchema = new Schema({
  title: String,
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = model('Question', QuestionSchema)
