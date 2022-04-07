import { Schema, model } from 'mongoose'
import { models } from '../types/models'
import IUser = models.IUser

const UserSchema = new Schema<IUser>({
  username: String,
  email: String,
  password: String,
  imagePath: String
})

export default model('User', UserSchema)
