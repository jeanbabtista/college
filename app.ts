const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
import db from './lib/db'
import { forwardToErrorHandler, errorRequestHandler } from './middleware/error'
import router from './routes/index'

// config
db.connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((e) => {
    console.error('Error connecting to database:', e)
    process.exit(1)
  })

const app = express()
app.set('view engine', 'hbs')

// middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// router
app.use('/', router)

// error handling
app.use(forwardToErrorHandler)
app.use(errorRequestHandler)

// server
const PORT = 5000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
