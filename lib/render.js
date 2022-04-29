const { globals } = require('../lib/hbs')

class Render {
  static error = (req, res, error) =>
    res.render('error', { e: error, ...globals(req.user) })

  static register = (req, res) =>
    res.render('register', { ...globals(req.user) })

  static login = (req, res) => res.render('login', { ...globals(req.user) })

  static info = (req, res, message) =>
    res.render('info', { message, ...globals(req.user) })

  static user = (
    req,
    res,
    user,
    questions,
    numQuestions,
    numAnswers,
    numChosenAnswers
  ) =>
    res.render('user', {
      currentUser: user,
      questions,
      numQuestions,
      numAnswers,
      numChosenAnswers,
      ...globals(req.user)
    })

  static users = (req, res, users) =>
    res.render('users', { users, ...globals(req.user) })

  static question = (req, res, question, answers, foundCorrectAnswer, tags) =>
    res.render('question', {
      question,
      answers,
      foundCorrectAnswer,
      tags,
      ...globals(req.user)
    })

  static questions = (req, res, questions, tags, filterTag, hotQuestions) =>
    res.render('index', {
      questions,
      tags,
      filterTag,
      hotQuestions,
      ...globals(req.user)
    })

  static redirectToIndex = (res) => res.redirect('/question')

  static redirectToLogin = (res) => res.redirect('/user/login')

  static reload = (res) => res.redirect('back')
}

module.exports = Render
