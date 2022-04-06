const { Router } = require('express')
const router = Router()
const questionController = require('../controllers/Question.js')

router.get('/', questionController.list)
router.get('/:id', questionController.show)
router.post('/', questionController.create)
router.put('/:id', questionController.update)
router.delete('/:id', questionController.remove)

module.exports = router
