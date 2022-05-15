const { Router } = require('express')
const upload = require('../config/multer')
const controller = require('../controllers/message')
const { isAuthenticated } = require('../middleware/auth')

const router = Router()
const { create, findOne, findAll, vote, markInappropriate, filterDecay, findByTags } = controller

/*
URL: POST http://localhost:5000/message
JSON: {
    "title": "my xth test message",
    "imagePath": "Test image 123 567",
    "user": "626c1df24deb2e27ae47db17",
    "tags": ["tag2", "tag3"]
} */
router.post('/', isAuthenticated, upload.single('imagePath'), create)

/*
URL: GET http://localhost:5000/message/626d4a807e0e69b0048a18fe/vote?option=down
 */
router.get('/:id/vote', isAuthenticated, vote)

/*
URL: GET http://localhost:5000/message/626d4a807e0e69b0048a18fe/inappropriate
*/
router.get('/:id/inappropriate', isAuthenticated, markInappropriate)

/*
URL: GET http://localhost:5000/message/decay
*/
router.get('/decay', filterDecay)

/*
URL: GET http://localhost:5000/message/626d4a807e0e69b0048a18fe
*/
router.get('/:id', findOne)

/*
URL: GET http://localhost:5000/message
*/
router.get('/', findAll)

/*
URL: GET http://localhost:5000/message/tags/tag1
*/
router.get('/tags/:tag', findByTags)

module.exports = router
