function populateContacts() {

	// Create api endpoint with userID encoded
	let url = urlBase + "contactController" + extension;
	url += "?UserID=" + id;

	// Send POST with our data to look up
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send();

	let contacts = JSON.parse(xhr.responseText);
	contacts.forEach(appendContact);
}

function appendContact(contact) {

	let contactFirst = contact["FirstName"];
	let contactLast = contact["LastName"];
	let contactInitials = contactFirst[0] + contactLast[0];
	let contactFullName = contactFirst + " " + contactLast;

	let contactLanding = document.getElementById("contactLanding");

	let contactLink = document.createElement("a");
	contactLink.className = "contact-link";
	contactLink.href = "#";

		let contactDiv = document.createElement("div");
		contactDiv.className = "list-group-item d-flex contact-card";
		contactDiv.style.minHeight = "50px";
		contactLink.appendChild(contactDiv);

			let profileIconDiv = document.createElement("div");
			profileIconDiv.className = "profile-icon d-flex justify-content-center align-self-center";
			contactDiv.appendChild(profileIconDiv);

				let innerDiv = document.createElement("div");
				innerDiv.className = "align-self-center";
				innerDiv.style.width = "100%";
				profileIconDiv.appendChild(innerDiv);

					let initials = document.createElement("h3");
					initials.style.textAlign = "center";
					initials.style.fontWeight = "300";
					initials.style.fontSize = "18px";
					initials.style.marginBottom = "0";
					initials.innerHTML = contactInitials;
					innerDiv.appendChild(initials);

			let nameDiv = document.createElement("div");
			nameDiv.className = "d-flex align-items-center justify-content-center w-100";
			nameDiv.style.padding = "5px";
			contactDiv.appendChild(nameDiv);

				let name = document.createElement("h5");
				name.style.textAlign = "center";
				name.style.margin = "0";
				name.style.width = "100%";
				name.innerHTML = contactFullName;
				nameDiv.appendChild(name);

	contactLanding.appendChild(contactLink);
}

/* <a class="contact-link" href="#">
	<div class="list-group-item d-flex contact-card" style="min-height: 50px">
		<div class="profile-icon d-flex justify-content-center align-self-center">
			<div class="align-self-center" style="width: 100%;">
				<h3 style="text-align: center; font-weight: 300; font-size: 18px; margin-bottom: 0">TM</h3>
			</div>
		</div>
		<div class="d-flex align-items-center justify-content-center w-100" style="padding: 5px;">
			<h5 style="text-align: center; margin: 0; width: 100%;">Tyler Mathis</h5>
		</div>
	</div>
</a> */

function doCreateContact()
{
	// Get all data
	let first = document.getElementById("new-first-name").value;
	let last = document.getElementById("new-last-name").value;
	let phone = document.getElementById("new-phone-number").value;
	let address = document.getElementById("new-address").value;
	let city = document.getElementById("new-city").value;
	let state = document.getElementById("new-state").value;
	let zip = document.getElementById("new-zip").value;

	// Create JSON payload and api endpoint
	let jsonPayload = JSON.stringify({
		"FirstName": first,
		"LastName": last,
		"PhoneNumber": phone,
		"Address": address,
		"City": city,
		"State": state,
		"ZIP": zip,
		"UserID": id
	});
	let url = urlBase + "contactController" + extension;

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