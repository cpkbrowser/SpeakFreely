var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var __ = require('underscore');
var mongoose = require('mongoose');
var TopicSessionController = require('../Controllers/TopicSessionController');
var TopicController = require('../Controllers/TopicController');
var LotteryController = require('../Controllers/LotteryController');
var youtube = require('../Controllers/YouTubeController');

router.post('/', function(req, res){
	//TopicSessionController.closeAllTopics(function(rslt) {
	//	res.json(rslt);
	//});{'responders': {"$elemMatch":{'email':'djbigdad@gmail.com'}}}  
	var Topic = connection.model('topic');
	Topic.find({}, function(err, rslt) {
		if (err) {
			res.json(err);
		} else if (rslt == null) {
			res.json({'status': 'not found'});
		} else {
			var found;
			rslt.forEach(function(item, index, array) {
				item.responders.forEach(function(item2, index2, array2) {
					if (item2.email == 'djbigdad@gmail.com' && item2.verification_code == '45678') {
						found = item;
					}
				});
			});
			if (found != null) {
				res.json({'status': 'success', 'data': found});
			} else {
				res.json({'status': 'not found'});
			}
		}
	});
});

module.exports = router;