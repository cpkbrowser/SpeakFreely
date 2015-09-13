var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {	
	var tvShow = new Schema({
		name: String,
		show_type: String,
		description: String,
		tags: String,
		year: String,
		img_url: String,
		host: String,
		link: String,
		seasons: String,
		watch_count: Number,
		actors: String
	});
	mongoose.model('testShow', tvShow);
};