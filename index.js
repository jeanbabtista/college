const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const db = require('./lib/db')
const passport = require('./config/passport/index')

// connect to database
db.connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((e) => console.error('Error connecting to database:', e.message))

// configure view engine
const app = express()
app.engine('hbs', require('./config/hbs'))
app.set('view engine', 'hbs')

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(session(require('./config/session')))
app.use(passport.initialize({}))
app.use(passport.session({}))

// routes
app.use(require('./routes/index'))

// server
const PORT = 5000
app.listen(PORT, () => console.log(`http://localhost:${PORT}/question`))
