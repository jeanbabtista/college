const { Router } = require('express')
const controller = require('../controllers/tag')

const router = Router()
const { findByTags } = controller

/*
URL: GET http://localhost:5000/tag/626d4a807e0e69b0048a1900
*/
router.get('/:id', findByTags)

module.exports = router
