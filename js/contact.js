let contactMap = new Map();
let selectedContact = -1;

function populateContacts(firstTime)
{
	// Clear all children of the contact holder
	let contactLanding = document.getElementById("contactLanding");
	while (contactLanding.firstChild)
		contactLanding.removeChild(contactLanding.firstChild);


	// Create api endpoint with userID encoded
	let url = urlBase + "contactController" + extension;
	url += "?UserID=" + id;

	// Send POST with our data to look up
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.send();

	contactMap.clear();
	let contacts = JSON.parse(xhr.responseText);
	if (contacts.length === undefined) return;

	contacts.forEach(appendContact);
	if (firstTime)
		selectContact(contacts[0]["ID"]);
}

function appendContact(contact)
{
	// Appends contacts with this structure
	/* 
	<a class="contact-link" href="#">
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
	</a>
	*/

	// Add contact to local map store
	let contactID = contact["ID"];
	contactMap[contactID] = contact;

	let contactFirst = contact["FirstName"];
	let contactLast = contact["LastName"];
	let contactInitials = contactFirst[0] + contactLast[0];
	let contactFullName = contactFirst + " " + contactLast;

	let contactLanding = document.getElementById("contactLanding");

	let contactLink = document.createElement("a");
	contactLink.style.color = "inherit";
	contactLink.className = "contact-link";
	contactLink.href = "javascript:selectContact(" + contactID + ")";

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

function selectContact(contactID)
{
	// Select the given contact and update info panel
	selectedContact = contactID;
	let contact = contactMap[contactID];
	document.getElementById("info-fullname").innerHTML = contact["FirstName"] + " " + contact["LastName"];
	document.getElementById("info-initials").innerHTML = contact["FirstName"][0] + contact["LastName"][0];
	document.getElementById("info-first-name").innerHTML = contact["FirstName"];
	document.getElementById("info-last-name").innerHTML = contact["LastName"];
	document.getElementById("info-phone-number").innerHTML = contact["PhoneNumber"];
	document.getElementById("info-address").innerHTML = contact["Address"];
	console.log(contact["ZIP"]);
	document.getElementById("info-zip").innerHTML = contact["ZIP"];
	document.getElementById("info-city").innerHTML = contact["City"];
	document.getElementById("info-state").innerHTML = contact["State"];

	// Get editing ready
	document.getElementById("edit-fullname").innerHTML = contact["FirstName"] + " " + contact["LastName"];
	document.getElementById("edit-initials").innerHTML = contact["FirstName"][0] + contact["LastName"][0];
	document.getElementById("edit-first-name").placeholder = contact["FirstName"];
	document.getElementById("edit-last-name").placeholder = contact["LastName"];
	document.getElementById("edit-phone-number").placeholder = contact["PhoneNumber"];
	document.getElementById("edit-address").placeholder = contact["Address"];
	document.getElementById("edit-zip").placeholder = contact["ZIP"];
	document.getElementById("edit-city").placeholder = contact["City"];
	document.getElementById("edit-state").value = contact["State"];
}

function deleteSelectedContact()
{
		// Create api endpoint with userID encoded
		let url = urlBase + "contactController" + extension;
		url += "?ID=" + selectedContact;
	
		// Send DELETE with our contact to delete
		let xhr = new XMLHttpRequest();
		xhr.open("DELETE", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		xhr.send();
	
		if (xhr.status === 200) {
			displayNotification("Success", "Contact deleted", "info");
		}
		else {
			let error = JSON.parse(xhr.responseText);
			displayNotification(error.title, error.detail, "danger");
		}

		populateContacts(true);
}

function editSelectedContact()
{
	alert("We don't support this feature yet, check back later!");
}

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

	populateContacts(false);
}