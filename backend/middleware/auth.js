const Render = require('../lib/render')

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()

  Render.info(req, res, 'You must be logged in to access this page')
}

const isUnauthenticated = (req, res, next) => {
  if (req.isUnauthenticated()) return next()

  Render.info(req, res, 'You are logged in already', {
    username: req.user.username,
    email: req.user.email,
  })
}

module.exports = {
  isAuthenticated,
  isUnauthenticated,
}
