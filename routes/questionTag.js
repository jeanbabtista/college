var express = require('express');
var router = express.Router();
var QuestionTagController = require('../controllers/QuestionTagController.js');

/*
 * GET
 */
router.get('/', QuestionTagController.list);

/*
 * GET
 */
router.get('/:id', QuestionTagController.show);

/*
 * POST
 */
router.post('/', QuestionTagController.create);

/*
 * PUT
 */
router.put('/:id', QuestionTagController.update);

/*
 * DELETE
 */
router.delete('/:id', QuestionTagController.remove);

module.exports = router;
