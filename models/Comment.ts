import { model, Schema } from 'mongoose'
import { models } from '../types/models'
import IComment = models.IComment

const CommentSchema = new Schema<IComment>({
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

export default model('Comment', CommentSchema)
