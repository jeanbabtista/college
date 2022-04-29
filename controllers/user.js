const UserModel = require('../models/user')
const QuestionModel = require('../models/question')
const AnswerModel = require('../models/answer')
const Render = require('../lib/render')

const findAll = async (req, res) => {
  try {
    const users = await UserModel.find().sort('-createdAt')
    Render.users(req, res, users)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id)
    if (!user) throw new Error('User not found')

    const numQuestions = await QuestionModel.countDocuments({ user: id })
    const numAnswers = await AnswerModel.countDocuments({ user: id })

    let numChosenAnswers = 0
    for ({ _id: question } of await QuestionModel.find({ user: id }))
      for ({ isCorrect } of await AnswerModel.find({ question }))
        numChosenAnswers += isCorrect ? 1 : 0

    Render.user(
      req,
      res,
      user,
      questions,
      numQuestions,
      numAnswers,
      numChosenAnswers
    )
  } catch (e) {
    Render.error(req, res, e)
  }
}

const create = async (req, res) => {
  try {
    const { username, password, email } = req.body
    const { file } = req

    const found = await UserModel.findOne({ email })
    if (found) throw new Error('User already exists.')

    const user = new UserModel({
      username,
      password,
      email,
      imagePath: file.filename
    })

    await user.save()

    Render.redirectToLogin(res)
  } catch (e) {
    Render.info(req, res, e.message)
  }
}

const getRegister = (req, res) => Render.register(req, res)

const getLogin = (req, res) => Render.login(req, res)

const logout = (req, res) => {
  req.logout()
  Render.redirectToLogin(res)
}

module.exports = {
  findAll,
  findOne,
  create,
  getRegister,
  getLogin,
  logout
}
