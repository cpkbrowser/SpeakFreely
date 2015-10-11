var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var __ = require('underscore');
var mongoose = require('mongoose');
var TopicSessionController = require('../controllers/TopicSessionController');
var TopicController = require('../controllers/TopicController');
var LotteryController = require('../controllers/LotteryController');
var youtube = require('../controllers/YouTubeController');

router.post('/', function(req, res){
	//TopicSessionController.closeAllTopics(function(rslt) {
	//	res.json(rslt);
	//});
	//TopicController.accessTopic_Responder(req.body.email, req.body.verification_code, function(rslt) {
	//	if (rslt.status != null) {
	//		var topic = rslt.data;
	//		topic.responders[rslt.index].youtube_id = req.body.id;
	//		TopicController.saveTopic(topic, function(rslt2) {
	//			res.json(rslt2);
	//		});
	//	} else {
	//		res.json(rslt);
	//	}
	//});
});

module.exports = router;