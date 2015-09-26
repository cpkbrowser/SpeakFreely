var express = require('express');
var router = express.Router();
var qs = require('querystring');
var http = require("http");
var auth = require('node-session-tokens')();
var TopicController = require('../controllers/TopicController');

router.post('/responder-video', function(req, res){
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		TopicController.accessTopic_Responder(req.body.email, req.body.verification_code, function(rslt) {
			if (rslt.status != null) {
				var topic = rslt.data;
				topic.responders[rslt.index].youtube_id = req.body.id;
				TopicController.saveTopic(topic, function(rslt2) {
					res.json(rslt2);
				});
			} else {
				res.json(rslt);
			}
		});
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});	
});

router.post('/post-video', function(req, res){
	auth.validateSession(req.headers.token, req.headers.nonce,
	function(response) {
		TopicController.accessTopic_PostAdmin(req.body.email, req.body.verification_code, function(rslt) {
			if (rslt.status != null) {
				var topic = rslt.data;
				topic.post_admin.youtube_id = req.body.id;
				TopicController.saveTopic(topic, function(rslt2) {
					res.json(rslt2);
				});
			} else {
				res.json(rslt);
			}
		});
	},
	function(error) {
		res.json({'status': 'error', 'rslt': 'Error validating session.'});
	});	
});

module.exports = router;