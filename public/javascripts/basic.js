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
		username: $("#in_usr").val(),
		password: $("#in_pass").val()
	}	 
	
	$.ajax({
		url: "http://localhost:3000/login",
        type: "POST",
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

