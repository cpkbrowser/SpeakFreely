var express = require('express');
var mongoose = require('mongoose');
var cpkAuth = require('../routes/cpkAuth');
var __ = require('underscore');
var moment = require('moment');
var YoutubeController = require('../controllers/YouTubeController');
var utilities = require('../controllers/UtilitiesController');
var lottery = require('../controllers/LotteryController'); 

module.exports.getTopic = function(category, callback) {
	
	var Topic = connection.model('topic');
	Topic.findOne({$and: [{'category': category}, {'active': 'true'}]}, function(err, rslt1) {
		if (err) {
			callback({'status': 'Database Error', 'data': null});
		} else if (rslt1 == null) {
			callback({'status': 'not found', 'data': null});
		} else {
			callback({'status': 'success', 'data': rslt1});
		}
	});
};

module.exports.getAllTopics = function(callback) {
	var Topics = connection.model('topic');	
	
	Topics.find({'active': 'true'}, 'category', function(err, rslt) {
		if (err) {
			callback({'status': 'Database Error', 'data': null});
		} else if (rslt == null) {
			callback({'status': 'not found', 'data': null});
		} else {	
			callback({'status': 'success', 'data': rslt});
		}
	});
};

module.exports.getTopicVideos = function(topic, callback) {
	var ids = '';
	var emails = [];
	topic.responders.forEach(function(item, index, array) {
		ids = (ids + item.youtube_id + ',');
		emails.push(item.email.split('@')[0]);
	});
	ids = ids.substring(0, ids.length - 1);
	console.log(ids);
	YoutubeController.getVideoByID(ids, function(rslt) {
		rslt = tieEmailToVideo(emails, rslt);
		rslt.postVid = topic.post_admin.youtube_id;
		callback(rslt);
	});
};

module.exports.accessTopic = function(post_id, verification_code, callback) {
	
	var Topics = connection.model('topic');	
	var id = cpkAuth.decryptPostID(post_id, 'postid_salt');
	
	Topics.findOne({'post_id': id}, function(err, rslt1) {
		if (err) {
			callback({'status': 'Database Error', 'role': null, 'data': null});
		} else if (rslt1 == null) {
			callback({'status': 'not found', 'role': null, 'data': null});
		} else {
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
};

module.exports.getViewCounts = function(topic, callback) {

	if (topic.max_responders == 0) {
		callback({'status': 'Max responders was never set on this topic'});
	} else {
		var errors = [];
		var scores = [];
		function ProcessComplete() {
			if (scores.length > 0) {
				utilities.mergeSort(scores, 'count', function(arr) {
					callback({'status': 'success', 'scores': arr, 'errors': errors});
				});
			} else {
				callback({'status': 'no urls were provided by responders'});
			}		
		}
		
		var finished = __.after(topic.max_responders, ProcessComplete);
		topic.responders.forEach(function(item, index, array) {
			YoutubeController.getVideoByID(item.youtube_id, function(data) {
				if (data.rslt.items[0] != null) {
						if (data.status == 'success') {
						scores.push({'email': item.email, 'id': item.youtube_id, 'count': data.rslt.items[0].statistics.viewCount});
					} else {
						errors.push({'email': item.email, 'id': item.youtube_id, 'error': data.rslt});
					}
					finished();
				} else {
					finished();
				}			
			});
		});
	}	
};

module.exports.createTopic = function(category, post_id, poster, callback) {
	//need to implement lottery function here
	//fill in 20 responders, leave max_responders = 0
	//once topic admin has set responder threshold, send email to x amount of responders.
	var Topics = connection.model('topic');
	var topicUser = connection.model('topic_user');
	var start = moment().utc().startOf('day').add(1, 'milliseconds');
	var end =  moment().utc().startOf('day').add(1, 'week');
	lottery.getLotteryRequests(function(rslt) {
		if (rslt.status == 'success') {
			var responders = [];
			var max = 20;
			if (rslt.data.length < max) { max = rslt.data.length };
			for (i = 0; i < max; i++) {
				responders.push(new topicUser({
					email: rslt.data[i].email,
					youtube_id: '',
					verification_code: newVerificationCode()
				}));
			}
			var newTopic = new Topics({
				post_id: post_id,
				category: category,
				post_admin: {
					email: poster,
					youtube_id: '',
					verification_code: newVerificationCode()
				},
				max_responders: 0,
				responders: responders,
				active: 'true',
				active_date: start,
				exp_date: end
			});
			callback({'status': 'success', 'data': newTopic});
		} else {
			callback(rslt);
		}
	});	
}

module.exports.saveTopic = function(topic, callback) {
	topic.save(function(err, rslt) {
		if (err) {
			callback({'status': 'error', 'data': err});
		} else {
			callback({'status': 'success', 'data': rslt});
		}
	});
};

module.exports.closeTopic = function(topic, callback) {
	topic.active = 'false';
	topic.save(function(err, rslt) {
		if (err) {
			callback({'status': 'error', 'data': err});
		} else {
			callback({'status': 'success', 'data': rslt});
		}
	});	
};

//Internal Functions
function newVerificationCode() {
    return parseInt(Math.random() * (9999 - 1000) + 1000);
}

function tieEmailToVideo(emails, videos) {
	videos.rslt.items.forEach(function(item, index, array) {
		item.email = emails[index];
	});
	return videos;
}