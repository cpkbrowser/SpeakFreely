var express = require('express');
var crypto = require('crypto');

module.exports.cpkEncrypt = function(pass, salt) {
	
	var cipher = crypto.createCipher('aes-256-cbc', salt);
	
	var encryptPass = cipher.update(pass, 'utf8', 'base64');
	encryptPass += cipher.final('base64');
	
	return encryptPass;
	
};

module.exports.cpkDecrypt = function(pass, dbpass, salt) {
	
	var decipher = crypto.createDecipher('aes-256-cbc', salt);
	
	var decryptPass = decipher.update(dbpass, 'base64', 'utf8');
	decryptPass += decipher.final('utf8');
	console.log(decryptPass);
	
	//return decryptPass;
	if (pass == decryptPass) {
		return true;
	} else {
		return false;
	}
	
};

module.exports.encryptPostID = function(post_id) {
	var cipher = crypto.createCipher('aes-256-cbc', 'postid_salt');
	
	var encryptPass = cipher.update(post_id, 'utf8', 'base64');
	encryptPass += cipher.final('base64');
	
	return encryptPass;
}

module.exports.decryptPostID = function(cypherText, salt) {
	
	var decipher = crypto.createDecipher('aes-256-cbc', salt);
	var decryptPass = decipher.update(cypherText, 'base64', 'utf8');
	decryptPass += decipher.final('utf8');
	return decryptPass;
	
}