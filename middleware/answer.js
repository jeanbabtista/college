const AnswerModel = require('../models/answer')
const Render = require('../lib/render')
const {
  Types: { ObjectId }
} = require('mongoose')

const isAnswerOwner = async (req, res, next) => {
  try {
    const { answerId } = req.params
    const { _id: userId } = req.user

    const answer = await AnswerModel.findById(answerId).populate('user')
    const isAnswerOwner = answer.user._id.equals(ObjectId(userId))

    isAnswerOwner ? next() : Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  isAnswerOwner
}
