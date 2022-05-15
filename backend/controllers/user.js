const UserModel = require('../models/user')
const MessageModel = require('../models/message')
const Render = require('../lib/render')

const findOne = async (req, res) => {
  try {
    const { id } = req.params

    const user = await UserModel.findById(id).select('-_id -__v -password')
    if (!user) throw new Error('User not found')

    // get number of messages per user
    const numMessages = await MessageModel.find({ user: id }).countDocuments()

    // get number of all votes
    const numVotes = (
      await MessageModel.find({ user: id }).populate('votes').select('votes')
    ).reduce((acc, { votes }) => acc + votes.length, 0)

    Render.user(req, res, { ...user._doc, numMessages, numVotes })
  } catch (e) {
    Render.error(req, res, e)
  }
}

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password || !email) throw new Error('Missing fields')

    const found = await UserModel.findOne({ email })
    if (found) throw new Error('User already exists')

    const user = new UserModel({
      username,
      password,
      email,
    })

    await user.save()
    Render.register(req, res)
  } catch (e) {
    Render.error(req, res, e)
  }
}

const login = (req, res) => {
  req.isAuthenticated()
    ? Render.info(req, res, 'Successfully logged in', {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      })
    : Render.error(req, res, 'Invalid credentials')
}

const logout = (req, res) => {
  req.logout()
  Render.info(req, res, 'Successfully logged out')
}

module.exports = {
  findOne,
  register,
  login,
  logout,
}
