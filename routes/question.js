const { Router } = require('express')
const { isAuthenticated } = require('../middleware/auth')
const { isQuestionOwner } = require('../middleware/question')
const controller = require('../controllers/question')
const answerRoute = require('./answer')

const router = Router()
const { findAll, findOne, create, remove } = controller

router.use('/:questionId/answer', answerRoute)

router.get('/', findAll)
router.get('/:questionId', findOne)
router.post('/', isAuthenticated, create)
router.get('/:questionId/delete', isAuthenticated, isQuestionOwner, remove)

module.exports = router
