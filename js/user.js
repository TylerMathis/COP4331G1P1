import { clearCookie, getCookie, saveCookie } from "./cookies";
import { displayError, displayNotification } from "./design";
import { createUser, loginUser } from "./userStore";

let firstName = "";
let lastName = "";
let fullName = "";
let id = -1;

/**
 * Converts a form to JSON.
 * @param {FormData} formData
 * @return {Object}
 */
const formToJSON = formData => {
	const data = {};
	formData.forEach((value, key) => data[key] = value);
	return data;
}

function submitLoginClicked(e) {
	// Prevent url encoding
	e.preventDefault()
	doLogin();
}

function submitCreateClicked(e) {
	// Prevent url encoding
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
	const remember = "Remember" in loginData;

	// Make request.
	loginUser(loginData).then(contact => {
		// Update cookie
		saveCookie(contact.FirstName, contact.LastName, contact.ID, remember);
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

        const login = userData.Login;
        const url = "index.html?loginPlaceholder=" + login;
		// Migrate to login after 2 seconds.
		setTimeout(() => window.location.href = url, 2000);
	}).catch(displayError);
}

/**
 * Parses the URL and tries to fill the login
 */
function autoFillLogin() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.has("loginPlaceholder")) {
        const login = document.getElementById("user");
        login.value = urlParams.get("loginPlaceholder");
    }
}

function welcomeUser() {
	document.getElementById("welcome").innerHTML = "Welcome " + fullName;
}

function doLogout()
{
	clearCookie();
	window.location.href = "index.html";
}

export { id, populateUserCache, welcomeUser, autoFillLogin, submitLoginClicked, submitCreateClicked, doLogout }
