const { model, Schema } = require('mongoose')

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    vote: {
      type: 'String',
      enum: ['up', 'down'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('Vote', schema)
