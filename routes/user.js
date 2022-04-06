const { Router } = require('express')
const router = Router()
const userController = require('../controllers/User.js')

router.get('/', userController.list)
router.get('/:id', userController.show)
router.post('/', userController.create)
router.put('/:id', userController.update)
router.delete('/:id', userController.remove)

module.exports = router
