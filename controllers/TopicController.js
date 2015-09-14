var express = require('express');
var mongoose = require('mongoose');

module.exports.getTopic = function(category, callback) {
	
	var db = mongoose.connection;
	
	db.on('error', function() {
		console.error.bind(console, 'connection error:');
		callback(null);
	});
	db.once('open', function() {
		
		var db = mongoose.connection;		
		var Topic = mongoose.model('topic');	
		
		Topic.findOne({'category': category}, function(err, rslt1) {
			if (err) {
				mongoose.disconnect();
				callback(null);
			} else if (rslt1 == null) {
				mongoose.disconnect();
				callback(null);
			} else {
				console.log('found');
				mongoose.disconnect();
				callback(rslt1);
			}
		});
	});	
	
	console.log('connecting');
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
};