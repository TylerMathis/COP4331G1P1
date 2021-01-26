// The duration of each cookie
const duration = 20;

// Save a cookie
function saveCookie(firstName, lastName, ID)
{
	let data = JSON.stringify({
        "FirstName" : firstName,
        "LastName" : lastName,
        "ID" : ID
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
    return Cookies.get("user");
}

// Returns the validity of a cookie
function validCookie()
{
    return getCookie() !== undefined;
}

// Automates login if possible
function autoLogin()
{
    if (!validCookie())
        return false;
        
    window.location.href = "landing_page.html";
    return true;
}

// Simply for debug.
function cookieDebug()
{
    let cookie = getCookie();

    document.getElementById("cookieStatus").innerHTML = JSON.stringify(cookie);
    document.getElementById("cookieValid").innerHTML = "Cookie is ".concat(validCookie()?"valid":"invalid");
}