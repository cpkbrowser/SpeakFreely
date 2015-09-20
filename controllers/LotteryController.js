var __ = require('underscore');
var mongoose = require('mongoose');
var util = require('../controllers/UtilitiesController');

module.exports.getLotteryRequests = function(callback) {
	var Requests = connection.model('lottery_request');	
	
	Requests.find({}, function(err, rslt) {
		if (err) {
			callback({'status': 'Database Error', 'data': null});
		} else if (rslt == null) {
			callback({'status': 'not found', 'data': null});
		} else {
			util.mergeSort(rslt, 'lottery_id', function(rslt2) {
				callback({'status': 'success', 'data': rslt2});
			});				
		}
	});
};


