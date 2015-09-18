var cpkAuth = require('../routes/cpkAuth');
var TopicController = require('../Controllers/TopicController');
var sbController = require('../Controllers/ScoreboardController');
var util = require('../Controllers/UtilitiesController');
var email = require('../Controllers/EmailController');

module.exports.closeTopicSession = function(topic, callback) {
	TopicController.getTopic('Politics', function(rslt) {
		if (rslt.status == "success") {
			var topic = rslt.data;
			sbController.generateScoreboard(topic, function(rslt2) {
				if (rslt2.status == 'success') {
					TopicController.closeTopic(topic, function(rslt3) {
						if (rslt3.status = 'success') {
							var newID = util.getNewPostID(topic.post_id);
							var newTopic = TopicController.createTopic(topic.category, newID, rslt2.data.winner);
							TopicController.saveTopic(newTopic, function(rslt4) {
								if (rslt4.status == 'success') {
									var notify = {
										'post_id': cpkAuth.encryptPostID(newTopic.post_id),
										'category': newTopic.category,
										'email': newTopic.post_admin.email,
										'verification_code': newTopic.post_admin.verification_code
									};
									email.NotifyPostAdmin(notify, function(rslt5) {
										callback(rslt5);
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

