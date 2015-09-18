var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {		
	var scoreboardSchema = new Schema({
		post_id: String,
		category: String,
		winner: String,
		rankings: [{
			email: String,
			id: String,
			count: String
		}],
		active_date: Date,
		exp_date: Date,
		compile_errors: [{
			email: String,
			id: String,
			error: String
		}]
	});
	mongoose.model('scoreboard', scoreboardSchema);
};