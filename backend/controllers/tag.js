const TagModel = require('../models/tag')
const MessageModel = require('../models/message')
const Render = require('../lib/render')

const find = async (req, res) => {
  try {
    const tags = await TagModel.find()
    return Render.info(req, res, 'Successfully fetched all tags', tags)
  } catch (e) {
    return Render.error(req, res, e)
  }
}

module.exports = {
  find,
}
