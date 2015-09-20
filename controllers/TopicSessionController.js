var cpkAuth = require('../routes/cpkAuth');
var __ = require('underscore');
var TopicController = require('../Controllers/TopicController');
var sbController = require('../Controllers/ScoreboardController');
var util = require('../Controllers/UtilitiesController');
var email = require('../Controllers/EmailController');

module.exports.closeAllTopics = function(callback) {
	TopicController.getAllTopics(function(rslt) {
		
		var results = [];
		function ProcessComplete() {
			callback({'status': 'success', 'data': results});
		}
		
		var finished = __.after(rslt.data.length, ProcessComplete);		
		rslt.data.forEach(function(item, index, array) {
			closeTopicSession(item.category, function(rslt2) {
				results.push(rslt2);
				finished();
			});	
		});
		
	});
};

function closeTopicSession(category, callback) {
	TopicController.getTopic(category, function(rslt) {
		if (rslt.status == "success") {
			var topic = rslt.data;
			sbController.generateScoreboard(topic, function(rslt2) {	
				if (rslt2.status == 'success') {
					TopicController.closeTopic(topic, function(rslt3) {
						if (rslt3.status = 'success') {
							var newID = util.getNewPostID(topic.post_id);
							TopicController.createTopic(topic.category, newID, rslt2.data.winner, function(rslt4) {
								var newTopic = rslt4.data;
								if (rslt4.status == 'success') {
									TopicController.saveTopic(newTopic, function(rslt5) {
										if (rslt5.status == 'success') {
											var notify = {
												'category': newTopic.category,
												'email': newTopic.post_admin.email,
												'verification_code': newTopic.post_admin.verification_code
											};
											email.NotifyPostAdmin(notify, function(rslt6) {
												callback(rslt6);
											});
										} else {
											callback(rslt5);
										}
									});
								} else {
									callback(rslt4);
								}
							});
						} else {
							callback(rslt3);
						}
					});
				} else {
					callback(rslt2);
				}
			});
		} else {
			callback(rslt);
		}
	});
};

