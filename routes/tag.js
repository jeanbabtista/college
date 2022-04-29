const { Router } = require('express')
const controller = require('../controllers/tag')

const router = Router()
const { create } = controller

router.post('/', create)

module.exports = router
