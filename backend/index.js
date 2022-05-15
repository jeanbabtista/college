const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { join } = require('path')
const db = require('./lib/db')
const passport = require('./config/passport/index')
const cors = require('./config/cors')

// connect to database
db.connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((e) => console.error('Error connecting to database:', e.message))

// configuration
const app = express()
app.use('/images', express.static(join(__dirname, 'images')))

// middleware
app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session(require('./config/session')))
app.use(passport.initialize({}))
app.use(passport.session({}))

// routes
app.use(require('./routes/index'))

// server
const PORT = 5000
app.listen(PORT, () => console.log(`http://localhost:${PORT}/user`))
