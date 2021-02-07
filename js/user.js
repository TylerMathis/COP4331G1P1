let firstName = "";
let lastName = "";
let fullName = "";
let id = -1;

const formToJSON = formData => {
	const data = {};
	formData.forEach((value, key) => data[key] = value);
	return data;
}

function submitLoginClicked(e) {
	// Prevent refreshing
	e.preventDefault()
	doLogin();
}

function submitCreateClicked(e) {
	// Prevent refreshing
	e.preventDefault();
	doCreateAccount();
}

/**
 * Populates the user data from the stored cookie.
 */
function populateUserCache() {
	let cookie = getCookie();
	firstName = cookie["FirstName"];
	lastName = cookie["LastName"];
	fullName = firstName + " " + lastName;
	id = cookie["ID"];
}

/**
 * Verifies and logs user with the given credentials in.
 *
 * @return {boolean} true on success, false otherwise.
 */
function doLogin()
{
	// Retrieve login and password
	const form = document.getElementById("login-form");
	const formData = new FormData(form);

	// Serialize data
	const loginData = formToJSON(formData);
	const remember = formData.Remember !== undefined;

	console.log(loginData);

	// Make request.
	loginUser(loginData).then(json => {
		// Update cookie
		saveCookie(json.FirstName, json.LastName, json.ID, remember);
		// Move to landing page.
		window.location.href = "landing_page.html";
	}).catch(displayError);
}

/**
 * Creates a new user.
 */
function doCreateAccount() {
	// Parse necessary data
	const formData = new FormData(document.getElementById("create-form"));
	const userData = formToJSON(formData);

	// Send request
	createUser(userData).then(() => {
		displayNotification("Success!", "Returning you back to login...", "success");
		// Migrate to login after 2 seconds.
		setTimeout(() => window.location.href = "index.html", 2000);
	}).catch(displayError);
}

function welcomeUser() {
	document.getElementById("welcome").innerHTML = "Welcome " + fullName;
}

function doLogout()
{
	clearCookie();
	window.location.href = "index.html";
}