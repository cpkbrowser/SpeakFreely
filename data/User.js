var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {	
	var userSchema = new Schema({
		first_name: String,
		last_name: String,
		username: String,
		pwd: String,
		slt: String,
		account_type: String,
		email: String,
		phone: String,
		birthday: String,
		country: String,
		zip_code: Number,
		age: String,
		gender: String,
		active_date: Date,
		country: String,
		send_mail: String
	});
	mongoose.model('user', userSchema);
};