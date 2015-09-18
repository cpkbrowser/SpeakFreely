var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var TopicController = require('../Controllers/TopicController');

router.post('/', function(req, res){
	console.log('id: ' + req.body.id);
	TopicController.accessTopic(req.body.id, req.body.code, function(rslt) {
		auth.createSession(
			function (response) {
				var token_data = {
					'token': response.sessionToken,
					'nonce': response.nonce,
					'expires': response.expirationDateTime
				};
				res.json({'status': 'success', 'rslt': rslt, 'token_data': token_data});
			},
			function(error) {
				console.log('error message: %s', error.message);
				res.json({'status': 'error', 'rslt': 'Error generating session.'});
			}
		);	
	});
});

module.exports = router;