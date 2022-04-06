const AnswerModel = require('../models/Answer.js')

/**
 * AnswerController.js
 *
 * @description :: Server-side logic for managing Answers.
 */
module.exports = {
  /**
   * AnswerController.list()
   */
  list(req, res) {
    AnswerModel.find((error, answer) => {
      if (err)
        return res.status(500).json({
          message: 'Error when getting Answer.',
          error,
        })

      return res.status(200).json(answer)
    })
  },

  /**
   * AnswerController.show()
   */
  show(req, res) {
    const { id: _id } = req.params

    AnswerModel.findOne({ _id }, function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Answer.',
          error: err,
        })
      }

      if (!Answer) {
        return res.status(404).json({
          message: 'No such Answer',
        })
      }

      return res.json(Answer)
    })
  },

  /**
   * AnswerController.create()
   */
  create(req, res) {
    const Answer = new AnswerModel({
      description: req.body.description,
      userId: req.body.userId,
      questionId: req.body.questionId,
      isCorrect: req.body.isCorrect,
      date: req.body.date,
      numUpvotes: req.body.numUpvotes,
      numDownvotes: req.body.numDownvotes,
    })

    Answer.save(function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating Answer',
          error: err,
        })
      }

      return res.status(201).json(Answer)
    })
  },

  /**
   * AnswerController.update()
   */
  update: function (req, res) {
    const id = req.params.id

    AnswerModel.findOne({ _id: id }, function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Answer',
          error: err,
        })
      }

      if (!Answer) {
        return res.status(404).json({
          message: 'No such Answer',
        })
      }

      Answer.description = req.body.description ? req.body.description : Answer.description
      Answer.userId = req.body.userId ? req.body.userId : Answer.userId
      Answer.questionId = req.body.questionId ? req.body.questionId : Answer.questionId
      Answer.isCorrect = req.body.isCorrect ? req.body.isCorrect : Answer.isCorrect
      Answer.date = req.body.date ? req.body.date : Answer.date
      Answer.numUpvotes = req.body.numUpvotes ? req.body.numUpvotes : Answer.numUpvotes
      Answer.numDownvotes = req.body.numDownvotes ? req.body.numDownvotes : Answer.numDownvotes

      Answer.save(function (err, Answer) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating Answer.',
            error: err,
          })
        }

        return res.json(Answer)
      })
    })
  },

  /**
   * AnswerController.remove()
   */
  remove: function (req, res) {
    const id = req.params.id

    AnswerModel.findByIdAndRemove(id, function (err, Answer) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the Answer.',
          error: err,
        })
      }

      return res.status(204).json()
    })
  },
}
