function doCreateContact()
{
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