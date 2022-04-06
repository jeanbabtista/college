var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var AnswerSchema = new Schema({
	'description' : String,
	'userId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'questionId' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Question'
	},
	'isCorrect' : Boolean,
	'date' : Date,
	'numUpvotes' : Number,
	'numDownvotes' : Number
});

module.exports = mongoose.model('Answer', AnswerSchema);
