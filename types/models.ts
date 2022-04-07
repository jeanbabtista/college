import { Types } from 'mongoose'

export declare namespace models {
  interface IAnswer {
    description: string
    userId: Types.ObjectId
    questionId: Types.ObjectId
    isCorrect: boolean
    numUpVotes: number
    numDownVotes: number
  }

  interface IComment {
    description: string
    questionId: Types.ObjectId
    answerId: Types.ObjectId
  }

  interface IQuestion {
    title: string
    description: string
    userId: Types.ObjectId
  }

  interface IQuestionTag {
    questionId: Types.ObjectId
    tagId: Types.ObjectId
  }

  interface ITag {
    title: string
  }

  interface IUser {
    username: string
    password: string
    email: string
    imagePath: string
  }
}
