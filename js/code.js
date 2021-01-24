const urlBase = 'LAMPAPI/';
const extension = '.php';

let userId = 0;
let firstName = "";
let lastName = "";

window.onload = function () {
	const image = new Image();

	// Swap blurred background on load.
	image.onload = function () {
		this.style.objectFit = "cover";
		this.style.width = "100%";
		this.style.height = "100%";
		document.getElementById("background").appendChild(this);
		document.getElementById("background").style.removeProperty("filter");
	};
	image.src = "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw=&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80";
};

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
		// noinspection JSUnresolvedVariable
		userId = response.ID;
        firstName = response.FirstName;
        lastName = response.LastName;
        // saveCookie();
		window.location.href = "landing_page.html";
	}
	// Invalid request
    else {
		let error = JSON.parse(xhr.responseText);
        displayNotification(error.title, error.detail, "danger");
    }

	return false;
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

function doContactCreate() {
	// Get all data
	let first = document.getElementById("first-name").value;
	let last = document.getElementById("last-name").value;
	let phone = document.getElementById("phone-number").value;
	let address = document.getElementById("address").value;
	let city = document.getElementById("city").value;
	let state = document.getElementById("state").value;
	let zip = document.getElementById("zip").value;

	// Create JSON payload and api endpoint
	let jsonPayload = JSON.stringify({
		"FirstName": first,
		"LastName": last,
		"PhoneNumber": phone,
		"Address": address,
		"City": city,
		"State": state,
		"ZIP": zip
    });
	let url = urlBase + "userController" + extension;

	// Send POST with our data to look up
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send(jsonPayload);

	// Valid creation
    if (xhr.status === 201) {
		displayNotification("Success!", "Contact created", "success");
	}
	// Invalid creation
    else {
		let error = JSON.parse(xhr.responseText);
		displayNotification(error.title, error.detail, "danger");
	}
	
	return false;
}

function displayNotification(title, desc, type) {
	let alertType = "alert-" + type;
	let loginView = document.getElementById("loginView");

	if (document.getElementById("notiDiv") != null) {
		let curNoti = document.getElementById("notiDiv");
		curNoti.parentNode.removeChild(curNoti);
	}

	let notiDiv = document.createElement("div");
	notiDiv.className = "alert " + alertType;
	notiDiv.style.width = "75%";
	notiDiv.id = "notiDiv";

	let notiHeader = document.createElement("h5");
	notiHeader.style.textAlign = "left";
	notiHeader.innerHTML = title;
	notiDiv.appendChild(notiHeader);

	let notiDesc = document.createElement("p");
	notiDesc.style.textAlign = "left";
	notiDesc.innerHTML = desc;
	notiDesc.style.marginBottom = "0px";
	notiDiv.appendChild(notiDesc);

	loginView.prepend(notiDiv);
}

/*
function saveCookie()
{
	const minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(let i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
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
*/
