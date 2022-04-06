const { Router } = require('express')
const router = Router()

router.get('/', function (_req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
