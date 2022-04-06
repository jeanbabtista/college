const QuestionModel = require('../models/Question.js')

/**
 * questionController.js
 *
 * @description :: Server-side logic for managing questions.
 */
module.exports = {
  /**
   * questionController.list()
   */
  list: function (req, res) {
    QuestionModel.find(function (err, questions) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting question.',
          error: err,
        })
      }

      return res.json(questions)
    })
  },

  /**
   * questionController.show()
   */
  show: function (req, res) {
    const id = req.params.id

    QuestionModel.findOne({ _id: id }, function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting question.',
          error: err,
        })
      }

      if (!question) {
        return res.status(404).json({
          message: 'No such question',
        })
      }

      return res.json(question)
    })
  },

  /**
   * questionController.create()
   */
  create: function (req, res) {
    const question = new QuestionModel({
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
      date: req.body.date,
    })

    question.save(function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating question',
          error: err,
        })
      }

      return res.status(201).json(question)
    })
  },

  /**
   * questionController.update()
   */
  update: function (req, res) {
    const id = req.params.id

    QuestionModel.findOne({ _id: id }, function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting question',
          error: err,
        })
      }

      if (!question) {
        return res.status(404).json({
          message: 'No such question',
        })
      }

      question.title = req.body.title ? req.body.title : question.title
      question.description = req.body.description ? req.body.description : question.description
      question.userId = req.body.userId ? req.body.userId : question.userId
      question.date = req.body.date ? req.body.date : question.date

      question.save(function (err, question) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating question.',
            error: err,
          })
        }

        return res.json(question)
      })
    })
  },

  /**
   * questionController.remove()
   */
  remove: function (req, res) {
    const id = req.params.id

    QuestionModel.findByIdAndRemove(id, function (err, question) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the question.',
          error: err,
        })
      }

      return res.status(204).json()
    })
  },
}
