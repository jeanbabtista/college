const { model, Schema } = require('mongoose')

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    votes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vote',
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    isInappropriateCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

schema.virtual('inappropriate').get(function () {
  return this.isInappropriateCount > 5
})

schema.virtual('numUpVotes').get(function () {
  return this.votes.filter(({ vote }) => vote === 'up').length
})

schema.virtual('numDownVotes').get(function () {
  return this.votes.filter(({ vote }) => vote === 'down').length
})

module.exports = model('Message', schema)
