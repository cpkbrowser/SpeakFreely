var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var topics = require('../controllers/YouTubeController');

router.post('/', function(req, res){
	
	console.log(req.headers.token + ',' + req.headers.nonce);
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		topics.getVideosByKeywords(req.body.phrase, function(rslt) {
			if (rslt == null) {
				res.json({'status': 'error', 'rslt': 'Error retrieving topic'});
			} else {
				res.json({'status': 'success', 'rslt': rslt.rslt});
			}
		});
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error retrieving topic'});
	});
	
});

module.exports = router;