const urlBase = 'LAMPAPI/';
const extension = '.php';

let firstName = "";
let lastName = "";
let fullName = "";
let id = -1;

function populateUserCache() {
	let cookie = getCookie();
	firstName = cookie["FirstName"];
	lastName = cookie["LastName"];
	fullName = firstName + " " + lastName;
	id = cookie["ID"];
}

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
		let remember = document.getElementById("remember-me").checked;
		// Always save a cookie, but store whether or not they want to be remembered
        saveCookie(response.FirstName, response.LastName, response.ID, remember);
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

function welcomeUser() {
	document.getElementById("welcome").innerHTML = "Welcome " + fullName;
}

function doLogout()
{
	clearCookie();
	window.location.href = "index.html";
}