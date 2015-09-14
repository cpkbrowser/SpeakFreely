var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();

router.post('/', function(req, res){
	
	console.log(req.headers.token + ',' + req.headers.nonce);
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		res.json({'status': 'success', 'rslt': 'This would be your return object'});
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});
	
});

module.exports = router;