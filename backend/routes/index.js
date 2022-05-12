const { Router } = require('express')
const router = Router()

router.use('/user', require('./user'))
router.use('/message', require('./message'))
router.use('/comment', require('./comment'))
router.use('/tag', require('./tag'))

module.exports = router
