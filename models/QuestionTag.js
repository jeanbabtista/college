var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuestionTagSchema = new Schema({
	'question_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Question'
	},
	'tag_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Tag'
	}
});

module.exports = mongoose.model('QuestionTag', QuestionTagSchema);
