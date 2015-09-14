var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {	
	var TopicSchema = new Schema({
		category: String,
		post_admin: {
			email: String,
			url: String,
			verification_code: Number
		},
		admin_token: String,
		max_responders: Number,
		responders: [
			{
				email: String,
				url: String,
				verification_code: Number
			}
		],
		responders_token: String,
		active: Boolean,
		active_date: Date,
		exp_date: Date
	});
	mongoose.model('topic', TopicSchema);
};