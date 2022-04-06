const QuestiontagModel = require('../models/QuestionTag.js')

/**
 * QuestionTagController.js
 *
 * @description :: Server-side logic for managing QuestionTags.
 */
module.exports = {
  /**
   * QuestionTagController.list()
   */
  list: function (req, res) {
    QuestiontagModel.find(function (err, QuestionTags) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting QuestionTag.',
          error: err,
        })
      }

      return res.json(QuestionTags)
    })
  },

  /**
   * QuestionTagController.show()
   */
  show: function (req, res) {
    const id = req.params.id

    QuestiontagModel.findOne({ _id: id }, function (err, QuestionTag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting QuestionTag.',
          error: err,
        })
      }

      if (!QuestionTag) {
        return res.status(404).json({
          message: 'No such QuestionTag',
        })
      }

      return res.json(QuestionTag)
    })
  },

  /**
   * QuestionTagController.create()
   */
  create: function (req, res) {
    const QuestionTag = new QuestiontagModel({
      question_id: req.body.question_id,
      tag_id: req.body.tag_id,
    })

    QuestionTag.save(function (err, QuestionTag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating QuestionTag',
          error: err,
        })
      }

      return res.status(201).json(QuestionTag)
    })
  },

  /**
   * QuestionTagController.update()
   */
  update: function (req, res) {
    const id = req.params.id

    QuestiontagModel.findOne({ _id: id }, function (err, QuestionTag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting QuestionTag',
          error: err,
        })
      }

      if (!QuestionTag) {
        return res.status(404).json({
          message: 'No such QuestionTag',
        })
      }

      QuestionTag.question_id = req.body.question_id ? req.body.question_id : QuestionTag.question_id
      QuestionTag.tag_id = req.body.tag_id ? req.body.tag_id : QuestionTag.tag_id

      QuestionTag.save(function (err, QuestionTag) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating QuestionTag.',
            error: err,
          })
        }

        return res.json(QuestionTag)
      })
    })
  },

  /**
   * QuestionTagController.remove()
   */
  remove: function (req, res) {
    const id = req.params.id

    QuestiontagModel.findByIdAndRemove(id, function (err, QuestionTag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the QuestionTag.',
          error: err,
        })
      }

      return res.status(204).json()
    })
  },
}
