const { model, Schema } = require('mongoose')

const schema = new Schema(
  {
    title: String,
    description: String,
    views: Number,
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

module.exports = model('Question', schema)
