const QuestionModel = require('../models/question')
const AnswerModel = require('../models/answer')
const TagModel = require('../models/tag')
const QuestionTagModel = require('../models/questionTag')
const Render = require('../lib/render')

const findAll = async (req, res) => {
  try {
    const { filterTag } = req.query
    const tags = await TagModel.find()

    let questions

    if (filterTag && filterTag !== 'index') {
      const tag = await TagModel.findOne({ title: filterTag })
      questions = await QuestionTagModel.find({ tag: tag._id })
        .populate({ path: 'question', populate: { path: 'user' } })
        .sort('-createdAt')
      questions = questions.map(({ question }) => question)
    } else
      questions = await QuestionModel.find().populate('user').sort('-createdAt')

    const selectedQuestions = []
    for ({ _id: question } of await QuestionModel.find()) {
      const timeLimit = 60 * 60 * 1000 // 60 minutes
      const answers = await AnswerModel.find({ question })
        .where('createdAt')
        .gt(Date.now() - timeLimit)

      if (answers.length)
        selectedQuestions.push({ question, numAnswers: answers.length })
    }

    const sortedQuestionsByActivity = selectedQuestions.sort(
      (a, b) => b.numAnswers - a.numAnswers
    )

    const hotQuestions = []
    for (const { question } of sortedQuestionsByActivity) {
      const newQuestion = await QuestionModel.findById(question)
        .populate('user')
        .sort('-createdAt')
      hotQuestions.push(newQuestion)
    }

    Render.questions(req, res, questions, tags, filterTag, hotQuestions)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const findOne = async (req, res) => {
  try {
    const { questionId: id } = req.params

    const question = await QuestionModel.findById(id).populate('user')
    await QuestionModel.findByIdAndUpdate(id, { $inc: { views: 1 } })

    const answers = await AnswerModel.find({ question: id })
      .populate('user')
      .sort('-createdAt')

    let foundCorrectAnswer = false
    answers.forEach((answer) => {
      if (answer.isCorrect) foundCorrectAnswer = true
    })

    const i = answers.findIndex((answer) => answer.isCorrect)
    if (i > 0) {
      const correctAnswer = answers.splice(i, 1)
      answers.unshift(correctAnswer[0])
    }

    const tags = await QuestionTagModel.find({ question: id })
      .populate('tag')
      .select('tag -_id')

    Render.question(
      req,
      res,
      question,
      answers,
      foundCorrectAnswer,
      tags.map(({ tag }) => tag)
    )
  } catch (e) {
    Render.error(req, res, e)
  }
}

const create = async (req, res) => {
  try {
    const { title, description, tags } = req.body
    const { _id: userId } = req.user

    const question = new QuestionModel({
      title,
      description,
      user: userId
    })

    for (const tag of tags) {
      const tagId = await TagModel.findOne({ title: tag })

      const questionTag = new QuestionTagModel({
        question: question._id,
        tag: tagId
      })

      await questionTag.save()
    }

    await question.save()

    Render.redirectToIndex(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const remove = async (req, res) => {
  try {
    const { questionId: id } = req.params

    await QuestionModel.findByIdAndRemove(id)
    await AnswerModel.remove({ question: id })
    await QuestionTagModel.remove({ question: id })

    Render.redirectToIndex(res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  remove
}
