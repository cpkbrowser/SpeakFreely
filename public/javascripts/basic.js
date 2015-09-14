var static_url = window.location;

$(document).ready(function() {
/* 	document.getElementById('container').style.height = $(window).height();
	document.getElementById('container').style.height = $(window).height(); */
	
	$(document).bind('keyup', function(e) {
		if (e.which === 13) {
			$.modal.close()
		} 
	});
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
	if (sessionStorage.token != null && sessionStorage.nonce != null) {
		var postData = {
			phrase: 'Burning Tide Rebel Soul'
		}	 
		
		$.ajax({
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
}

