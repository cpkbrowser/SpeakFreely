var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {	
	var topicUserSchema = new Schema({
		email: String,
		youtube_id: String,
		verification_code: Number
	});
	mongoose.model('topic_user', topicUserSchema);
	
	var TopicSchema = new Schema({
		post_id: String,
		category: String,
		post_admin: {
			email: String,
			youtube_id: String,
			verification_code: Number
		},
		max_responders: Number,
		responders: [topicUserSchema],
		active: String,
		active_date: Date,
		exp_date: Date
	});
	mongoose.model('topic', TopicSchema);
};