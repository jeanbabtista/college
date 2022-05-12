const CommentModel = require('../models/comment')
const MessageModel = require('../models/message')
const UserModel = require('../models/user')
const Render = require('../lib/render')

const create = async (req, res) => {
  try {
    const { messageId, text, user: userId } = req.body
    if (!messageId || !text || !userId) throw new Error('Missing parameters')

    const user = await UserModel.findById(userId)
    if (!user) throw new Error('User not found')

    const message = await MessageModel.findById(messageId)
    if (!message) throw new Error('Message not found')

    const comment = new CommentModel({ text, user })
    await comment.save()
    await MessageModel.updateOne({ _id: message._id }, { $push: { comments: comment._id } })

    Render.info(req, res, 'Successfully created comment')
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  create,
}
