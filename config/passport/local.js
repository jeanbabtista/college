const passport = require('passport')
const Strategy = require('passport-local')
const { isValidPassword } = require('../../lib/auth')
const UserModel = require('../../models/user')

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await UserModel.findById(id)
    cb(null, user)
  } catch (e) {
    cb(e)
  }
})

module.exports = new Strategy({}, async (username, password, cb) => {
  try {
    const user = await UserModel.findOne({ username })
    if (!user) return cb(null, null)

    const { password: hash } = user

    const isValid = isValidPassword(password, hash)
    cb(null, isValid ? user : null)
  } catch (e) {
    cb(e)
  }
})
