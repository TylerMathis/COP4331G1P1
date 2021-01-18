var urlBase = 'LAMPAPI/';
var extension = '.php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	// Reset loginStatus
	document.getElementById("loginStatus").innerHTML = "";

	// Retrieve login and password
	var login = document.getElementById("user").value;
	var password = document.getElementById("pass").value;

    // Check if either login or password is blank
    if (login.length == 0 || password.length == 0) {
        alert("Please provide a " + (login.length == 0 ? "username" : "password"));
        return false;
    }

	// Hash the password
	var hash = md5(password);
	
	// Create jsonPayload and api endpoint
	var jsonPayload = {
	     "Login" : login,
	     "Password" : hash
	};
	var url = urlBase + "Login" + extension;

	// Send POST with our data to look up
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);

	// Valid request
	if (xhr.status == 200) {
		var response = JSON.parse(xhr.responseText);
		userId = response.ID;
        firstName = response.FirstName;
        lastName = response.LastName;
        saveCookie();
        window.location.href = "landing_page.html";
	}
	// Invalid request
    else {
		var error = JSON.parse(xhr.responseText);
        document.getElementById("loginStatus").innerHTML = error.title;
    }
}

function goToCreateAccount() 
{
	window.location.href = "create_account.html";
}

function goToLogin()
{
	window.location.href = "index.html";
}

function doAccountCreate() {
    // Get all document elements
	var newFirst = document.getElementById("first-name").value;
	var newLast = document.getElementById("last-name").value;
	var login = document.getElementById("user").value;
	var password = document.getElementById("pass").value;

	// Check if they entered values for First name/ Last name
	if (newFirst.length == 0 || newLast.length == 0) 
	{
		alert("Make sure you type in a " + (newFirst.length == 0 ? "first name!" : "last name!"));
		return false;
	}

	// Check if they entered values for User and Password
	if (login.length == 0 || password.length == 0) 
	{
		alert("Make sure you type in a " + (login.length == 0 ? "Username!" : "Password!"));
		return false;
	}

	// Hash password
	var hash = md5(password);

	// Create jsonPayload and api endpoint
	jsonPayload = '{"FirstName" : "' + newFirst + '", "LastName" : "' + newLast + '", "Login" : "' + login + '", "Password" : "' + hash + '"}';
	url = urlBase + "CreateAccount" + extension;

	// Send POST with our data to look up
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);

	// Valid creation
    if (xhr.status == 201) 
		window.location.href = "index.html";
	// Invalid creation
    else {
        var jsonResponse = JSON.parse(xhr.responseText);
		document.getElementById("loginStatus").innerHTML = jsonResponse.title;
    }
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
