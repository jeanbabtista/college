const { Router } = require('express')
const controller = require('../controllers/comment')

const router = Router()
const { findAll, findOne, create, update, remove } = controller

router.get('/', findAll)
router.get('/:id', findOne)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router
