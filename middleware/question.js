const QuestionModel = require('../models/question')
const Render = require('../lib/render')
const {
  Types: { ObjectId }
} = require('mongoose')

const isQuestionOwner = async (req, res, next) => {
  try {
    const { questionId } = req.params
    const { _id: userId } = req.user

    const question = await QuestionModel.findById(questionId).populate('user')
    const isQuestionOwner = question.user._id.equals(ObjectId(userId))

    isQuestionOwner ? next() : Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  isQuestionOwner
}
