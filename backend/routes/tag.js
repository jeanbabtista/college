const { Router } = require('express')
const controller = require('../controllers/tag')

const router = Router()
const { find } = controller

/*
URL: GET http://localhost:5000/tag
*/
router.get('/', find)

module.exports = router
