var email = require("emailjs");

module.exports.NotifyPostAdmin = function(data, callback) {
	var template = getTemplate_Standard();
	var msg = formatMessage_PostAdmin(template, data);
	var subject = 'You won, time to post your video!';
	SendMail(data.email, subject, subject, msg, function(success) {
		if (success) {
			callback({'status': 'success'});
		} else {
			callback({'status': 'error sending mail'});
		}
	});
};


//Internal Functions
function SendMail(emlToAddr, emlSubject, emlMessage, emlHtml, callback) {
	
	var server  = email.server.connect({
		user: "media@cpkbrowser.com", 
		password: "mediaman.4all", 
		host: "just39.justhost.com", 
		port: 465,
		ssl: true
	});
	
	var message = {
		text: emlMessage, 
		from: "CPK Browser <media@cpkbrowser.com>", 
		to: emlToAddr,
		subject: emlSubject,
		attachment: 
		[
			{data: emlHtml, alternative:true}
		]
	};  
	
	server.send(message, function(err, message) {
		if (err) {
			console.log(err);
			callback(false);
		} else {
			console.log('Message Sent');
			callback(true);
		}
	});
	
};

function getTemplate_Standard() {
	var myString = (function () {
		/*
		<html>
		<body style="background-color: #353535">
		<div style="font-family: verdana, arial, sans-serif; padding-top: 10px; margin:0 auto; display:block; max-width: 800px;">
		<img style="width: 98.3%; max-width: 798px; height:auto; border: 7px solid black; border-bottom: none;
		-webkit-border-top-left-radius: 24px;
		-webkit-border-top-right-radius: 24px;
		-moz-border-radius-topleft: 24px;
		-moz-border-radius-topright: 24px;
		border-top-left-radius: 24px;
		border-top-right-radius: 24px;" src="http://cpkbrowser.com/Email.jpg">
		</img>
		<div style="color:white; border: 7px solid black; margin-top: -3px; background: black; padding:20px 10px 10px 10px;
		-webkit-border-bottom-left-radius: 24px;
		-webkit-border-bottom-right-radius: 24px;
		-moz-border-radius-bottomleft: 24px;
		-moz-border-radius-bottomright: 24px;
		border-bottom-left-radius: 24px;
		border-bottom-right-radius: 24px;">
		<h1 style="color:#ee2225; margin-top:0; font-size: 27px; padding-bottom: 10px; border-bottom: 1px solid #ee2225; text-align: center;">
		Congratulations, you won!
		</h1>
		<p style="line-height:2; color:white; font-size:14px;">
		Your video received the most views in the topic category: 'xyzCATEGORYzyx'. Please go to the URL below and follow
		the instructions on the page to post next week's discussion video.
		<p style="line-height:2; color:white; font-size:14px;">
		<span>Login URL: </span><span>xyzURLzyx</span>
		<br />
		<span>Verification Code: </span><span>xyzVCODEzyx</span>
		</p>
		<p style="line-height:2; color:white; font-size:14px;">
		If you have any questions, concerns, or just want to talk about our product, please send an email to Support@speakfreely.com. 
		Thank you again for signing up for Speak Freely, have a great day!
		</p>
		<p style="font-size: 14px; padding-top: 20px; border-top: 1px solid #ee2225; color: white; text-align: center;">
		<a style="color: #ee2225; text-decoration: none;" href="http://www.speakfreely.com">&copy;&nbsp;speakfreely.com</a><br>			
		</p>
		</div>
		</div>       
		</body>
		</html>
		*/
	});	
	return myString.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
}

function formatMessage_PostAdmin(template, data) {
	var msg = template.replace('xyzCATEGORYzyx', data.category);
	msg = msg.replace('xyzURLzyx', 'http://speakfreely.com/loginByCode#' + data.post_id);
	return msg.replace('xyzVCODEzyx', data.verification_code);
}