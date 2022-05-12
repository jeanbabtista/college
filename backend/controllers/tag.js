const TagModel = require('../models/tag')
const MessageModel = require('../models/message')
const Render = require('../lib/render')

const findByTags = async (req, res) => {
  try {
    const { id } = req.params

    const tag = await TagModel.findById(id)
    if (!tag) throw new Error('Tag not found')

    // filter messages by tags
    const messages = await MessageModel.find({ tags: id }).populate('user').populate('votes')

    Render.info(req, res, 'Successfully fetched all messages by tag', messages)
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  findByTags,
}
