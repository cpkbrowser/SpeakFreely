var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {		
	var LotterySchema = new Schema({
		'email': String,
		'gender': String,
		'country_code': String,
		'region_code': String,
		'lottery_id': Number
	});
	mongoose.model('lottery_request', LotterySchema);
};