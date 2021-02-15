import { validateResponse, jsonHeader } from "./APIUtil";

/**
 * Gets the expanded url for the given filename.
 *
 * @param fileBase The base to prepend.
 * @returns {string} The expanded URL.
 */
const urlFor = (fileBase) => { return "LAMPAPI/" + fileBase + ".php"; }

/**
 * @typedef User
 * @param {string} FirstName
 * @param {string} LastName
 * @param {string} Login
 * @param {string} Password
 * @param {int} ID
 */

/**
 * Creates a new User in the DB.
 *
 * @param {User} user The user to create
 * @return {Promise<Response>}
 */
async function createUser(user) {
    return await fetch(urlFor("createUser"), {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(user)
    })
    .then(validateResponse);
}

/**
 * Attempts to log user in.
 *
 * @param {FormData} loginData The login data including the username and password.
 * @return {Promise<Contact>}
 */
async function loginUser(loginData) {
    return await fetch(urlFor("login"), {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(loginData)
    })
    .then(validateResponse)
    .then(response => response.json());
}

export { createUser, loginUser };
