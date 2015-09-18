var express = require('express');
var mongoose = require('mongoose');
var cpkAuth = require('../routes/cpkAuth');
var __ = require('underscore');
var moment = require('moment');
var YoutubeController = require('../Controllers/YouTubeController');
var utilities = require('../Controllers/UtilitiesController');

module.exports.getTopic = function(category, callback) {
	
	var db = mongoose.connection;
	
	db.on('error', function() {
		console.error.bind(console, 'connection error:');
		callback({'status': 'Database Error', 'data': null});
	});
	db.once('open', function() {
		
		var db = mongoose.connection;		
		var Topic = mongoose.model('topic');	
		
		Topic.findOne({$and: [{'category': category}, {'active': 'true'}]}, function(err, rslt1) {
			if (err) {
				mongoose.disconnect();
				callback({'status': 'Database Error', 'data': null});
			} else if (rslt1 == null) {
				mongoose.disconnect();
				callback({'status': 'not found', 'data': null});
			} else {
				mongoose.disconnect();
				callback({'status': 'success', 'data': rslt1});
			}
		});
	});	
	
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
};

module.exports.accessTopic = function(post_id, verification_code, callback) {
	
	var db = mongoose.connection;
	
	db.on('error', function() {
		console.error.bind(console, 'connection error:');
		callback({'status': 'Database Error', 'role': null, 'data': null});
	});
	db.once('open', function() {
		
		var Topics = mongoose.model('topic');	
		var id = cpkAuth.decryptPostID(post_id, 'postid_salt');
		
		Topics.findOne({'post_id': id}, function(err, rslt1) {
			if (err) {
				mongoose.disconnect();
				callback({'status': 'Database Error', 'role': null, 'data': null});
			} else if (rslt1 == null) {
				mongoose.disconnect();
				callback({'status': 'not found', 'role': null, 'data': null});
			} else {
				mongoose.disconnect();
				if (rslt1.post_admin.verification_code == verification_code) {
					callback({'status': 'success', 'role': 'post_admin', 'data': rslt1});
				} else {
					rslt1.responders.forEach(function(item, index, array) {
						if (item.verification_code == verification_code) {
							callback({'status': 'success', 'role': 'responder', 'data': rslt1});
						}
					});
					callback({'status': 'not found', 'role': null, 'data': null});
				}
			}
		});		
		
	});	
	
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
};

module.exports.getViewCounts = function(topic, callback) {
	
	var errors = [];
	var scores = [];
	function ProcessComplete() {
		utilities.mergeSort(scores, function(arr) {
			callback({'status': 'success', 'scores': arr, 'errors': errors});
		});			
	}
	
	var finished = __.after(topic.max_responders, ProcessComplete);
	topic.responders.forEach(function(item, index, array) {
		YoutubeController.getVideoByID(item.youtube_id, function(data) {
			if (data.status == 'success') {
				scores.push({'email': item.email, 'id': item.youtube_id, 'count': data.rslt.items[0].statistics.viewCount});
			} else {
				errors.push({'email': item.email, 'id': item.youtube_id, 'error': data.rslt});
			}
			finished();
		});
	});
	
};

module.exports.createTopic = function(category, post_id, poster, callback) {
	//need to implement lottery function here
	//fill in 20 responders, leave max_responders = 0
	//once topic admin has set responder threshold, send email to x amount of responders.
	var Topics = mongoose.model('topic');
	var start = moment().utc().startOf('day').add(1, 'milliseconds');
	var end =  moment().utc().startOf('day').add(1, 'week');
	return new Topics({
		post_id: post_id,
		category: category,
		post_admin: {
			email: poster,
			youtube_id: '',
			verification_code: newVerificationCode()
		},
		max_responders: 0,
		responders: [],
		active: 'true',
		active_date: start,
		exp_date: end
	});
}

module.exports.saveTopic = function(topic, callback) {
	var db = mongoose.connection;
	
	db.on('error', function() {
		console.error.bind(console, 'connection error:');
		callback({'status': 'Database Error', 'role': null, 'data': null});
	});
	db.once('open', function() {
		
		topic.save(function(err, rslt) {
			mongoose.disconnect();
			if (err) {
				callback({'status': 'error', 'data': err});
			} else {
				callback({'status': 'success', 'data': rslt});
			}
		});
	});
	
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
}

module.exports.closeTopic = function(topic, callback) {
	
	var db = mongoose.connection;
	
	db.on('error', function() {
		console.error.bind(console, 'connection error:');
		callback({'status': 'Database Error', 'role': null, 'data': null});
	});
	db.once('open', function() {
		topic.active = 'false';
		topic.save(function(err, rslt) {
			mongoose.disconnect();
			if (err) {
				callback({'status': 'error', 'data': err});
			} else {
				callback({'status': 'success', 'data': rslt});
			}
		});
	});
	
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
	
};

//Internal Functions
function newVerificationCode() {
    return parseInt(Math.random() * (9999 - 1000) + 1000);
}