const urlBase = 'LAMPAPI/';
const extension = '.php';

function goToLogin() { window.location.href = "index.html"; }
function doLogin()
{
	// Reset loginStatus
	document.getElementById("loginStatus").innerHTML = "";

	// Retrieve login and password
	let login = document.getElementById("user").value;
	let password = document.getElementById("pass").value;
	
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
        saveCookie(response.firstName, response.lastName, response.ID);
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
		displayNotification("Success!", "Please return to login", "success");
	}
	// Invalid creation
    else {
		let error = JSON.parse(xhr.responseText);
		displayNotification(error.title, error.detail, "danger");
	}
	
	return false;
}