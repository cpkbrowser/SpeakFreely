var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var YoutubeControler = require('../Controllers/YouTubeController');

router.get('/id', function(req, res){
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		YoutubeControler.getVideoByID(req.query.id, function(rslt) {
			res.json(rslt);
		});
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});	
});

router.get('/keywords', function(req, res){
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		YoutubeControler.getVideosByKeywords(req.query.keywords, function(rslt) {
			res.json(rslt);
		});
	},
	function(error) {
		console.log(error);
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});	
});

module.exports = router;