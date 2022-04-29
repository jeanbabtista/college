const passport = require('passport')
passport.use(require('./local'))

module.exports = passport
