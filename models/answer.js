const { model, Schema } = require('mongoose')

const schema = new Schema(
  {
    description: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    isCorrect: Boolean,
    numUpVotes: Number,
    numDownVotes: Number
  },
  { timestamps: true }
)

module.exports = model('Answer', schema)
