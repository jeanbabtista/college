import { model, Schema } from 'mongoose'
import { models } from '../types/models'
import IAnswer = models.IAnswer

const AnswerSchema = new Schema<IAnswer>(
  {
    description: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    },
    isCorrect: Boolean,
    numUpVotes: Number,
    numDownVotes: Number
  },
  { timestamps: true }
)

export default model('Answer', AnswerSchema)
