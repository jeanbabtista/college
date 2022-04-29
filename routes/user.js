const { Router } = require('express')
const controller = require('../controllers/user')
const passport = require('passport')
const {
  isAuthenticated,
  redirectToIndexIfAuthenticated
} = require('../middleware/auth')
const upload = require('../config/multer')

const router = Router()
const { findAll, findOne, create, getRegister, getLogin, logout } = controller

router.get('/register', redirectToIndexIfAuthenticated, getRegister)
router.post(
  '/register',
  redirectToIndexIfAuthenticated,
  upload.single('avatar'),
  create
)
router.get('/login', redirectToIndexIfAuthenticated, getLogin)
router.post(
  '/login',
  redirectToIndexIfAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/question',
    failureRedirect: '/user/login'
  })
)
router.get('/logout', isAuthenticated, logout)

router.get('/', findAll)
router.get('/:id', findOne)

module.exports = router
