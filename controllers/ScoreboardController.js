var express = require('express');
var mongoose = require('mongoose');
var __ = require('underscore');
var TopicController = require('../Controllers/TopicController');

module.exports.generateScoreboard = function(topic, callback) {
	TopicController.getViewCounts(topic, function(data) {
		if (data.scores.length > 0) {
			var sbModel = mongoose.model('scoreboard');
			var scoreboard = new sbModel({
				post_id: topic.post_id,
				category: topic.category,
				winner: data.scores[0].email,
				rankings: data.scores,
				active_date: topic.active_date,
				exp_date: topic.exp_date,
				compile_errors: data.errors
			}); 
			saveScoreboard(scoreboard, function(data2) {
				callback(data2);
			});
		} else {
			callback({'status': 'error', 'data': data});
		}
	});
};

function saveScoreboard(scoreboard, callback) {
	
	var db = mongoose.connection;
	
	db.on('error', function() {
		console.error.bind(console, 'connection error:');
		callback({'status': 'Database Error', 'data': 'On Connection'});
	});
	db.once('open', function() {
		var sbModel = mongoose.model('scoreboard');	
		scoreboard.save(function(err, rslt) {
			if (err) {
				mongoose.disconnect();
				callback({'status': 'Database Error', 'data': err});
			} else if (rslt == null) {
				mongoose.disconnect();
				callback({'status': 'not found', 'data': null});
			} else {
				mongoose.disconnect();
				callback({'status': 'success', data: rslt});
			}
		});
		
	});	
	
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
};
