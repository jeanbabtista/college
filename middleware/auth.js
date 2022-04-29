const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/user/login')
}

const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect('/question')
  next()
}

module.exports = {
  isAuthenticated,
  redirectToIndexIfAuthenticated: redirectIfAuthenticated
}
