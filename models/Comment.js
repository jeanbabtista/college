var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CommentSchema = new Schema({
	'question_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Question'
	},
	'answerId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Answer'
	}
});

module.exports = mongoose.model('Comment', CommentSchema);
