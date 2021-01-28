// The duration of each cookie
const duration = 20;

// Save a cookie
function saveCookie(firstName, lastName, ID, remember)
{
	let data = JSON.stringify({
        "FirstName" : firstName,
        "LastName" : lastName,
        "ID" : ID,
        "Remember" : remember
    });
    Cookies.set("user", data);
}

// Clears a cookie
function clearCookie()
{
    Cookies.remove("user");
}

// Returns cookie in JSON format
function getCookie()
{
    let cookie = Cookies.get("user");
    if (cookie === undefined)
        return undefined;
    return JSON.parse(cookie);
}

// Returns the validity of a cookie
function validCookie()
{
    let cookie = getCookie();
    return !(cookie === undefined || !cookie["Remember"]);
}

// Automates login if possible
function autoLogin()
{
    if (!validCookie())
        return false;
        
    window.location.href = "landing_page.html";
    return true;
}