const AnswerModel = require('../models/answer')
const Render = require('../lib/render')

const setCorrect = async (req, res) => {
  try {
    const { answerId } = req.params
    await AnswerModel.findByIdAndUpdate(answerId, { $set: { isCorrect: true } })

    Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const setIncorrect = async (req, res) => {
  try {
    const { answerId } = req.params
    await AnswerModel.findByIdAndUpdate(answerId, {
      $set: { isCorrect: false }
    })

    Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const create = async (req, res) => {
  try {
    const { description, questionId } = req.body
    const { _id: userId } = req.user

    const answer = new AnswerModel({
      description,
      user: userId,
      question: questionId,
      isCorrect: false,
      numUpVotes: 0,
      numDownVotes: 0
    })

    await answer.save()

    Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const remove = async (req, res) => {
  try {
    const { answerId: id } = req.params
    await AnswerModel.findByIdAndRemove(id)

    Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const upVote = async (req, res) => {
  try {
    const { answerId } = req.params

    const answer = await AnswerModel.findById(answerId)
    await AnswerModel.findByIdAndUpdate(answerId, {
      $set: { numUpVotes: answer.numUpVotes + 1 }
    })

    Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const downVote = async (req, res) => {
  try {
    const { answerId } = req.params

    const answer = await AnswerModel.findById(answerId)
    await AnswerModel.findByIdAndUpdate(answerId, {
      $set: { numDownVotes: answer.numDownVotes + 1 }
    })

    Render.reload(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  setCorrect,
  setIncorrect,
  create,
  remove,
  upVote,
  downVote
}
