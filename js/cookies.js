// The duration of each cookie
const duration = 20;

// Save a cookie with indicated duration
function saveCookie(firstName, lastName, ID)
{
	let date = new Date();
	date.setTime(date.getTime()+(duration*60*1000));	
	document.cookie = JSON.stringify({
        "FirstName" : firstName,
        "LastName" : lastName,
        "ID" : ID,
        "Expires" : date.toGMTString()
    });
}

// Clears a cookie
function clearCookie()
{
    document.cookie = JSON.stringify({
        "FirstName" : null,
        "LastName" : null,
        "ID" : null,
        "Expires" : null
    });
}

// Returns cookie in JSON format
function getCookie()
{
	return JSON.parse(document.cookie);
}

// Returns the validity of a cookie
function validCookie()
{
    let cookie = getCookie();
    if (cookie === "" || cookie["ID"] === null)
        return false;
    
    let curTime = Date.now();
    let expires = Date.parse(cookie["Expires"]);
    return expires > curTime;
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