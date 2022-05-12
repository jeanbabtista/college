const { Router } = require('express')
const controller = require('../controllers/comment')
const { isAuthenticated } = require('../middleware/auth')

const router = Router()
const { create } = controller

/*
URL: POST http://localhost:5000/comment
JSON: {
    "messageId": "626d30b8d31249f7b7246a56",
    "user": "626c1df24deb2e27ae47db17",
    "text": "Wow! what a nice message!"
} */
router.post('/', isAuthenticated, create)

module.exports = router
