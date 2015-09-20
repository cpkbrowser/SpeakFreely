var express = require('express');
var mongoose = require('mongoose');
var __ = require('underscore');
var TopicController = require('../controllers/TopicController');

module.exports.generateScoreboard = function(topic, callback) {
	TopicController.getViewCounts(topic, function(data) {
		if (data.status == 'success') {
			var sbModel = connection.model('scoreboard');
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
	var sbModel = connection.model('scoreboard');	
	scoreboard.save(function(err, rslt) {
		if (err) {
			callback({'status': 'Database Error', 'data': err});
		} else if (rslt == null) {
			callback({'status': 'not found', 'data': null});
		} else {
			callback({'status': 'success', data: rslt});
		}
	});
};
