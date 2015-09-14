var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var mongoose = require('mongoose');
var cpkAuth = require('../routes/cpkAuth');
var auth = require('node-session-tokens')();
require('date-utils');

router.post('/', function(req, res){
	var db = mongoose.connection;
	
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
		
		var db = mongoose.connection;		
		var testUser = mongoose.model('user');	
		
		testUser.findOne({'email': String(req.body.email).trim()}, function(err, rslt1) {
			if (err) {
				mongoose.disconnect();
				res.json({'success': 'error', 'rslt': 'Error Connecting to Database'});
			} else if (rslt1 == null) {
				mongoose.disconnect();
				res.json({'success': 'false', 'rslt': 'Could Not Find User'});
			} else {
				mongoose.disconnect();
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
							res.json({'success': 'true', 'rslt': valid});
						},
						function(error) {
							console.log('error message: %s', error.message);
							res.json({'success': 'false', 'rslt': ''});
						}
					);	
				} else {
					res.json({'success': 'false', 'rslt': 'Could Not Validate User'});
				}				
			}
		});
	});
	
	mongoose.connect('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
});

module.exports = router;