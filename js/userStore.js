const jsonHeader = { "Content-Type": "application/json; charset=UTF-8" };
const urlFor = (fileBase) => { return "LAMPAPI/" + fileBase + ".php"; }

/**
 * Creates a new User in the DB.
 *
 * @param {Object} user The user to create
 * @return {Promise<Response>}
 */
async function createUser(user) {
    return await fetch(urlFor("createUser"), {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(user)
    })
    .then(handleResponse);
}

/**
 * Attempts to log user in.
 *
 * @param loginData The login data including the username and password.
 * @return {Promise<any>}
 */
async function loginUser(loginData) {
    return await fetch(urlFor("login"), {
        method: "POST",
        headers: jsonHeader,
        body: JSON.stringify(loginData)
    })
    .then(handleResponse)
    .then(response => response.json());
}

