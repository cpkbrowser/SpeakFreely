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
	console.log(req.get('origin'));
	res.json({'status': 'success', 'data': req.get('host'), 'data2': req.headers.referer, 'data3': req.headers.origin});
	
});

module.exports = router;