const MessageModel = require('../models/message')
const TagModel = require('../models/tag')
const VoteModel = require('../models/vote')
const UserModel = require('../models/user')
const Render = require('../lib/render')
const decay = require('decay')

const create = async (req, res) => {
  try {
    if (!req.file) throw new Error('Missing image')
    const imagePath = req.file.path

    const { title, user: userId, tags } = req.body
    // tags example: ['tag1', 'tag2']

    if (!title || !userId || !tags) throw new Error('Missing parameters')

    const user = await UserModel.findById(userId)
    if (!user) throw new Error('User not found')

    const message = new MessageModel({ title, imagePath, user: user._id })

    // find tags or create them
    for (const title of tags) {
      let tag = await TagModel.findOne({ title })

      if (!tag) {
        tag = new TagModel({ title })
        await tag.save()
      }

      message.tags.push(tag._id)
    }

    await message.save()

    const created = await MessageModel.findById(message._id)
      .populate('user', 'username -_id')
      .populate('tags', 'title -_id')
      .populate({
        path: 'comments',
        sort: { created_at: 1 },
        populate: {
          path: 'user',
        },
      })
      .populate('votes', 'vote createdAt -_id')

    Render.info(req, res, 'Message successfully created', created)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const findOne = async (req, res) => {
  try {
    const { id } = req.params

    const message = await MessageModel.findById(id)
      .populate('user', 'username -_id')
      .populate('tags', 'title -_id')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
      })
      .populate('votes', 'vote createdAt -_id')

    if (!message) throw new Error('Message not found')

    Render.info(req, res, 'Successfully fetched message', message)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const findAll = async (req, res) => {
  try {
    const messages = await MessageModel.find()
      .populate('user')
      .populate('votes')
      .populate('tags', 'title -_id')
      .sort({ createdAt: -1 })

    Render.info(req, res, 'Successfully fetched all messages', messages)
  } catch (e) {
    Render.error(req, res, e)
  }
}

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

const vote = async (req, res) => {
  try {
    const { id: messageId } = req.params
    const { option } = req.query

    if (!option) throw new Error('Missing parameters')
    if (option !== 'up' && option !== 'down') throw new Error('Invalid option')

    const message = await MessageModel.findById(messageId).populate({
      path: 'votes',
      populate: { path: 'user' },
    })

    if (!message) throw new Error('Message not found')

    for (const vote of message.votes)
      if (vote.user._id.equals(req.user._id)) throw new Error('You already voted')

    const vote = new VoteModel({ user: req.user._id, message: message._id, vote: option })
    await vote.save()
    await MessageModel.findByIdAndUpdate(messageId, { $push: { votes: vote._id } })

    Render.info(req, res, 'Successfully voted')
  } catch (e) {
    Render.error(req, res, e)
  }
}

const markInappropriate = async (req, res) => {
  try {
    const { id: messageId } = req.params

    const message = await MessageModel.findById(messageId)
    if (!message) throw new Error('Message not found')

    await MessageModel.updateOne({ _id: messageId }, { $inc: { isInappropriateCount: 1 } })

    Render.info(req, res, 'Successfully marked as inappropriate', message)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const filterDecay = async (req, res) => {
  try {
    const messages = await MessageModel.find()
      .populate('user')
      .populate('votes')
      .sort({ createdAt: -1 })

    const scores = new Map()
    messages.forEach((message) => {
      const decayAlgorithm = decay.redditHot()
      const score = decayAlgorithm(message.numUpVotes, message.numDownVotes, message.createdAt)
      scores.set(message._id.toString(), { score, message })
    })

    const filtered = [...scores].sort((a, b) => b.score - a.score).map((arr) => arr[1].message)

    Render.info(req, res, 'Successfully filtered messages', filtered)
  } catch (e) {
    Render.error(req, res, e)
  }
}

module.exports = {
  create,
  findOne,
  findAll,
  findByTags,
  filterDecay,
  vote,
  markInappropriate,
}
