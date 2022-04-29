const { Router } = require('express')
const controller = require('../controllers/answer')
const { isAuthenticated } = require('../middleware/auth')
const { isAnswerOwner } = require('../middleware/answer')
const { isQuestionOwner } = require('../middleware/question')

const router = Router({ mergeParams: true })
const { setCorrect, setIncorrect, create, remove, upVote, downVote } =
  controller

router.get('/:answerId/true', isAuthenticated, isQuestionOwner, setCorrect)
router.get('/:answerId/false', isAuthenticated, isQuestionOwner, setIncorrect)
router.post('/', isAuthenticated, create)
router.get('/:answerId/delete', isAuthenticated, isAnswerOwner, remove)
router.get('/:answerId/upvote', upVote)
router.get('/:answerId/downvote', downVote)

module.exports = router
