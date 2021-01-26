const urlBase = 'LAMPAPI/';
const extension = '.php';

// Tries to autologin a user. If it can't then it loads the hi res background
window.onload = function () {
	const dom = "https://contactical.xyz/";
	if ((window.location.href == dom.concat("index.html") ||
		window.location.href == dom) && autoLogin())
		return;
	loadHiRes();
};

function goToLogin() { window.location.href = "index.html"; }
function doLogin(login, password)
{
	// Retrieve login and password
	if (login === undefined)
		login = document.getElementById("user").value;
	if (password === undefined)
		password = document.getElementById("pass").value;
	
	// Create jsonPayload and api endpoint
	let jsonPayload = JSON.stringify({
	     "Login" : login,
		 "Password" : password
	});

	let url = urlBase + "login" + extension;

	// Send POST with our data to look up
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);

	// Valid request
	if (xhr.status === 200) {
		let response = JSON.parse(xhr.responseText);
		if (document.getElementById("remember-me").checked)
        	saveCookie(response.FirstName, response.LastName, response.ID);
		window.location.href = "landing_page.html";
	}
	// Invalid request
    else {
		let error = JSON.parse(xhr.responseText);
        displayNotification(error.title, error.detail, "danger");
    }

	return false;
}

function goToCreateAccount() { window.location.href = "create_account.html"; }
function doCreateAccount()
{
    // Get all document elements
	let first = document.getElementById("first-name").value;
	let last = document.getElementById("last-name").value;
	let login = document.getElementById("user").value;
	let password = document.getElementById("pass").value;

	// Create jsonPayload and api endpoint
    let jsonPayload = JSON.stringify({
        "FirstName" : first,
        "LastName" : last,
        "Login" : login,
        "Password" : password
    });
	let url = urlBase + "createUser" + extension;

	// Send POST with our data to look up
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);

	// Valid creation
    if (xhr.status === 201) {
		displayNotification("Success!", "Login you in...", "success");
		setTimeout(doLogin(login, password), 2000);
	}
	// Invalid creation
    else {
		let error = JSON.parse(xhr.responseText);
		displayNotification(error.title, error.detail, "danger");
	}
	
	return false;
}

function doLogout()
{
	clearCookie();
	window.location.href = "index.html";
}