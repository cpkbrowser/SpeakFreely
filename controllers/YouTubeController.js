var express = require('express');
var request = require('request');

module.exports.getVideoByID = function(id, callback) {
	var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics%2Csnippet&id=' + id + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var rslt = JSON.parse(body);
			callback({'status': 'success', 'rslt': rslt});
		} else {
			callback({'status': 'error', 'rslt': response.statusCode});
		}
	});
};

module.exports.getVideosByKeywords = function(phrase, callback) {
	var keywords = phrase.replace('/ /g', '+');
	var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=' + keywords + '&key=AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU';
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var rslt = JSON.parse(body);
			callback({'status': 'success', 'rslt': rslt});
		} else {
			callback({'status': 'error', 'rslt': response.statusCode});
		}
	});
};