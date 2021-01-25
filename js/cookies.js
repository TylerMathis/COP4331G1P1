function saveCookie(firstName, lastName, ID)
{
    const duration = 20;
	let date = new Date();
	date.setTime(date.getTime()+(duration*60*1000));	
	document.cookie = JSON.stringify({
        "firstName" : firstName,
        "lastName" : lastName,
        "ID" : ID,
        "expires:" : date.toGMTString()
    });
}

function clearCookie()
{
    document.cookie = JSON.stringify({
        "firstName" : -1,
        "lastName" : -1,
        "userID" : -1,
        "expires" : "Thu, 01 Jan 1970 00:00:00 GMT"
    });
}

function getCookie()
{
	let data = document.cookie;
	return JSON.parse(data);
}