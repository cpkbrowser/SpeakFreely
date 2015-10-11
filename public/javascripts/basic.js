var static_url = window.location;

$(document).ready(function() {
/* 	document.getElementById('container').style.height = $(window).height();
	document.getElementById('container').style.height = $(window).height(); */
	
	$(document).bind('keyup', function(e) {
		if (e.which === 13) {
			$.modal.close()
		} 
	});
	
	$.getJSON("http://www.telize.com/geoip?callback=?",
		function(json) {
    		sessionStorage.country_code = json.country_code;
			sessionStorage.region_code = json.region_code;
		}
	);
});

function login() {
	var postData = {
		email: $("#in_usr").val(),
		password: $("#in_pass").val()
	}	 
	
	$.ajax({
		url: "http://localhost:3000/login",
        type: "POST",
		data: postData,
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
        success: function (rslt) {
            sessionStorage.token = rslt.rslt.token;
			sessionStorage.nonce = rslt.rslt.nonce;
        },
        error: function (rslt) {
            alert('Error connecting to server, please contact support.');
        }
    });	
}

function test() {
	var postData = {
		email: 'info@cpkbrowser.com',
		verification_code: '8558',
		id: 'zxR00790x6A'
	}
	var x = 1;
	$.ajax({
		//url: 'http://joepodiumapi.herokuapp.com/test',
		url: "http://localhost:3000/test",
		type: "POST",
		headers: {
			token: sessionStorage.token,
			nonce: sessionStorage.nonce
		},
		data: postData,
		contentType: 'application/x-www-form-urlencoded',
		dataType: 'json',
		success: function (rslt) {
			var x = 1;
		},
		error: function (rslt) {
			alert('Error connecting to server, please contact support.');
		}
	});		
}

