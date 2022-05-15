const { Router } = require('express')
const controller = require('../controllers/user')
const passport = require('passport')
const { isAuthenticated, isUnauthenticated } = require('../middleware/auth')

const router = Router()
const { findOne, register, login, logout } = controller

/*
URL: POST http://localhost:5000/user
JSON: {
  "username": "asdf",
  "password": "asdf",
  "email": "asdf.asdf@gmail.com"
}
*/
router.post('/', isUnauthenticated, register)

/*
URL: POST http://localhost:5000/user/login
JSON: {
  "username": "asdf",
  "password": "asdf"
}
*/
router.post('/login', isUnauthenticated, passport.authenticate('local'), login)

/*
URL: GET http://localhost:5000/user/logout
*/
router.get('/logout', isAuthenticated, logout)

/*
URL: GET http://localhost:5000/user/626c1df24deb2e27ae47db17
*/
router.get('/:id', findOne)

module.exports = router
