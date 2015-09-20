var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var mongoose = require('mongoose');
var cpkAuth = require('../routes/cpkAuth');
var auth = require('node-session-tokens')();
require('date-utils');

router.post('/', function(req, res){
	var testUser = connection.model('user');	
	
	testUser.findOne({'email': String(req.body.email).trim()}, function(err, rslt1) {
		if (err) {
			res.json({'status': 'error', 'rslt': 'Error Connecting to Database'});
		} else if (rslt1 == null) {
			res.json({'status': 'error', 'rslt': 'Could Not Find User'});
		} else {
			var pass = rslt1.pwd;
			var salt = rslt1.slt;
			var valid = 'false';
			
			console.log(req.body.password);
			if (cpkAuth.cpkDecrypt(String(req.body.password).trim(), pass, salt)) {				
				auth.createSession(
					function (response) {
						valid = {
							'id': rslt1._id,
							'email': rslt1.email,
							'token': response.sessionToken,
							'nonce': response.nonce,
							'expires': response.expirationDateTime
						};
						res.json({'status': 'success', 'rslt': valid});
					},
					function(error) {
						console.log('error message: %s', error.message);
						res.json({'status': 'error', 'rslt': 'Error generating session.'});
					}
				);	
			} else {
				res.json({'status': 'error', 'rslt': 'Could Not Validate User'});
			}				
		}
	});
});

module.exports = router;