import { Schema, model } from 'mongoose'
import { models } from '../types/models'
import IQuestionTag = models.IQuestionTag

const QuestionTagSchema = new Schema<IQuestionTag>({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }
})

export default model('QuestionTag', QuestionTagSchema)
