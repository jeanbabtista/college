import { Schema, model } from 'mongoose'
import { models } from '../types/models'
import ITag = models.ITag

const TagSchema = new Schema<ITag>({
  title: String
})

export default model('Tag', TagSchema)
