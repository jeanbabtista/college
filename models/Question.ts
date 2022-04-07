import { Schema, model } from 'mongoose'
import { models } from '../types/models'
import IQuestion = models.IQuestion

const QuestionSchema = new Schema<IQuestion>(
  {
    title: String,
    description: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

export default model('Question', QuestionSchema)
