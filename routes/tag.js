const { Router } = require('express')
const router = Router()
const tagController = require('../controllers/Tag.js')

router.get('/', tagController.list)
router.get('/:id', tagController.show)
router.post('/', tagController.create)
router.put('/:id', tagController.update)
router.delete('/:id', tagController.remove)

module.exports = router
