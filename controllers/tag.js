const TagModel = require('../models/Tag.js')

/**
 * TagController.js
 *
 * @description :: Server-side logic for managing Tags.
 */
module.exports = {
  /**
   * TagController.list()
   */
  list: function (req, res) {
    TagModel.find(function (err, Tags) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Tag.',
          error: err,
        })
      }

      return res.json(Tags)
    })
  },

  /**
   * TagController.show()
   */
  show: function (req, res) {
    const id = req.params.id

    TagModel.findOne({ _id: id }, function (err, Tag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Tag.',
          error: err,
        })
      }

      if (!Tag) {
        return res.status(404).json({
          message: 'No such Tag',
        })
      }

      return res.json(Tag)
    })
  },

  /**
   * TagController.create()
   */
  create: function (req, res) {
    const Tag = new TagModel({
      title: req.body.title,
    })

    Tag.save(function (err, Tag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating Tag',
          error: err,
        })
      }

      return res.status(201).json(Tag)
    })
  },

  /**
   * TagController.update()
   */
  update: function (req, res) {
    const id = req.params.id

    TagModel.findOne({ _id: id }, function (err, Tag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting Tag',
          error: err,
        })
      }

      if (!Tag) {
        return res.status(404).json({
          message: 'No such Tag',
        })
      }

      Tag.title = req.body.title ? req.body.title : Tag.title

      Tag.save(function (err, Tag) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating Tag.',
            error: err,
          })
        }

        return res.json(Tag)
      })
    })
  },

  /**
   * TagController.remove()
   */
  remove: function (req, res) {
    const id = req.params.id

    TagModel.findByIdAndRemove(id, function (err, Tag) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the Tag.',
          error: err,
        })
      }

      return res.status(204).json()
    })
  },
}
