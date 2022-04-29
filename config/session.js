const MongoStore = require('connect-mongo')
const db = require('../lib/db')

module.exports = {
  secret: process.env.SECRET || 'foo',
  saveUninitialized: true,
  resave: false,
  store: MongoStore.create({ mongoUrl: db.url }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}
