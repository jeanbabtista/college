const CommentModel = require('../models/comment')

const findAll = async (req, res) => {
  try {
    const response = await CommentModel.find()
  } catch (e) {
    res.render('error', { e })
  }
}

const findOne = (req, res) => {
  try {
    const id = req.params.id
    const response = CommentModel.findById(id)

    if (!response) throw new Error('Comment not found')
  } catch (e) {
    res.render('error', { e })
  }
}

const create = async (req, res) => {
  try {
    const { description, questionId, answerId } = req.body
    const comment = new CommentModel({ description, questionId, answerId })
    const response = await comment.save()
  } catch (e) {
    res.render('error', { e })
  }
}

const update = async (req, res) => {
  try {
    const { id } = req.params
    const { description, questionId, answerId } = req.body

    const response = await CommentModel.findByIdAndUpdate(id, {
      description,
      questionId,
      answerId
    })
  } catch (e) {
    res.render('error', { e })
  }
}

const remove = async (req, res) => {
  try {
    const { id } = req.params
    const response = await CommentModel.findByIdAndRemove(id)
  } catch (e) {
    res.render('error', { e })
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  update,
  remove
}
