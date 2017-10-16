var res;
var params = {};

var sessionData = {};

var username;
var password;


$(document).ready(function(){
	createLoginEar();
	createNewUserEar();
})

function createLoginEar(){
	
	$("#login-button").click(function(event){
		username = $("#username").val();
		password = $("#password").val();
		if(username){
			params.username = $("#username").val();
		}
		if(password){
			params.password = $("#password").val();
		}
		event.preventDefault(); //prevent form from clearing
		console.log("input entered");
		$.ajax({
			type: "GET",
			xhrFields: { withCredentials: true },
		    crossDomain: true,
			url: config.dataURL+"/login/login.sjs",
			data: params,
			success: function(data){
				if(data == "true"){
					sessionData.username = username;
					sessionData.start_year = "1980";
					sessionData.end_year = "2017";
					updateSessionData(sessionData);
					window.location.href = "dashboard.html";
				} else{
					alert("login 1 failed");
					invalidLogin();
				}
			},
			error: function(data){
				invalidLogin();
			}
		});
	});
	
	
	
}

function invalidLogin(){
	document.getElementById("password").value = "";
	$("#password").attr("placeholder","Password");
	$("#error-message").remove();
	$("#error-message-cont").append("div").attr("id","error-message")
	.attr("class","alert alert-danger").text("Invalid Username or Password. Try again.");
}

function createNewUserEar(){
	$("#new-user-button").click(function(event){
		
	})
}

function createNewUser(){
	
}
