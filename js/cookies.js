/**
 * Saves a cookie.
 *
 * @param {string} firstName
 * @param {string} lastName
 * @param {int} ID
 * @param {boolean} remember
 */
function saveCookie(firstName, lastName, ID, remember) {
	let data = JSON.stringify({
        "FirstName" : firstName,
        "LastName" : lastName,
        "ID" : ID,
        "Remember" : remember
    });
    Cookies.set("user", data);
}

/**
 * Clears the current cookie.
 */
function clearCookie() {
    Cookies.remove("user");
}

/**
 * Gets the current cookie.
 *
 * @returns {Object|undefined}
 */
function getCookie() {
    let cookie = Cookies.get("user");
    if (cookie === undefined)
        return undefined;
    return JSON.parse(cookie);
}

/**
 * Checks where the cookie is valid or not.
 *
 * @returns {boolean}
 */
function validCookie() {
    let cookie = getCookie();
    return !(cookie === undefined || !cookie["Remember"]);
}

/**
 * Checks whether the login can be automatic or not.
 *
 * @returns {boolean}
 */
function autoLogin() {
    if (!validCookie())
        return false;

    window.location.href = "landing_page.html";
    return true;
}

export { getCookie, validCookie, saveCookie, clearCookie, autoLogin };
