import { Router } from 'express'
import answerController from '../routes/answer'
import commentController from '../routes/comment'
import questionController from '../routes/question'
import questionTagController from '../routes/questionTag'
import tagController from '../routes/tag'
import userController from '../routes/user'

const router = Router()

router.use('/answer', answerController)
router.use('/comment', commentController)
router.use('/question', questionController)
router.use('/question/tag', questionTagController)
router.use('/tag', tagController)
router.use('/user', userController)

export default router
