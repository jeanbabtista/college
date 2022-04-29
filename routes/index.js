const { Router } = require('express')
const router = Router()

router.use('/question', require('./question'))
router.use('/user', require('./user'))
router.use('/tag', require('./tag'))

module.exports = router
