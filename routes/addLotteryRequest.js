var express = require('express');
var router = express.Router();
var LotteryController = require('../controllers/LotteryController');

router.post('/', function(req, res){
	
	var origin = req.headers.origin;
	//if (origin == 'http://theurloftheactualwebsite.com') {
	if (origin != '') {
		var lottery_request = connection.model('lottery_request');
		
		function createLotteryID(max) {
			return parseInt(Math.random() * (max - 1000) + 1000);
		}
		
		function applyWeight(val) {
			if (val >= 25 && val < 35) {
				return 2;
			} else if (val >= 35 && val < 50) {
				return 3;
			} else if (val >= 50) {
				return 4;
			} else {
				return 0;
			}
		}
		
		LotteryController.getLotteryRequests(req.body.topic, function(rslt) {
			
			if (rslt.status == 'success') {
				var points = 9.999;
				if (rslt.data.length > 10) {
					var gender_match = rslt.data.filter(function(val) {
						if (val.gender == req.body.gender) {
							return true;
						}
					});
					var region_match = rslt.data.filter(function(val) {
						if (val.region_code == req.body.region) {
							return true;
						}
					});
					var gender_percent = parseInt((gender_match.length / rslt.data.length) * 100);
					var region_percent = parseInt((region_match.length / rslt.data.length) * 100);
					points = points - applyWeight(gender_percent);
					points = points - applyWeight(region_percent);
				}
				
				points = parseInt(points * 1000);
				var request = new lottery_request({
					'email': req.body.email,
					'gender': req.body.gender,
					'topic': req.body.topic,
					'country_code': req.body.country,
					'region_code': req.body.region,
					'lottery_id': createLotteryID(points)
				});
				LotteryController.saveLotteryRequest(request, function(rslt2) {
					res.json(rslt2);
				});
			} else {
				res.json(rslt);
			}
		});
	} else {
		res.json({'status': 'Cross Origin Request Not Allowed'});
	}
});

module.exports = router;