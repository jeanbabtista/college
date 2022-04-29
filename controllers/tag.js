const TagModel = require('../models/tag')

const create = async (req, res) => {
  try {
    const { tag: title } = req.body

    const found = await TagModel.findOne({ title })
    if (found) throw new Error('Tag already exists')

    const tag = new TagModel({ title })
    await tag.save()

    res.json({ error: false, message: `Tag '${title}' created` })
  } catch ({ message }) {
    res.json({ error: true, message })
  }
}

module.exports = {
  create
}
