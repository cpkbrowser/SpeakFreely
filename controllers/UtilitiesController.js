var express = require('express');
var __ = require('underscore');

module.exports.mergeSort = function(array, obj, callback) {
	
	function Sort(arr) {
		if (arr.length < 2)
			return arr;
	
		var middle = parseInt(arr.length / 2);
		var left   = arr.slice(0, middle);
		var right  = arr.slice(middle, arr.length);
	
		return merge(Sort(left), Sort(right));
	}
	
	function merge(left, right) {
		var result = [];
	
		while (left.length && right.length) {
			if (parseInt(left[0][obj]) >= parseInt(right[0][obj])) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}
	
		while (left.length)
			result.push(left.shift());
	
		while (right.length)
			result.push(right.shift());
	
		return result;
	}
	
	var rslt = Sort(array);
	callback(rslt);
	
};

module.exports.getNewPostID = function(id) {
	var prefix = id.substring(0, 2);
	var num = parseInt(id.substring(2)) + 1;
	return prefix + String(num);
};

