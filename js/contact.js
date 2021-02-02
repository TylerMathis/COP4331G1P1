// Local store for all contacts
let contacts = [];
let selectedContact = undefined;
let selectedIndex = -1;

// Assign event handlers.
$(document).on("click", ".contact-link", onClickContact);
$(document).on("click", "#delete-btn", onClickDelete);
$(document).on("click", "#create-btn", onClickCreate);

function onClickContact(e) {
	e.preventDefault();

	// Capture index stored in html.
	const index = $(this).attr("index");
	selectedIndex = index;

	// Fetch contact from local cache.
	const contact = contacts[index];
	displayContact(contact);

	// Update selected index.
	selectedContact = contact;
}

function onClickDelete(e) {
	e.preventDefault();

	console.log(selectedContact);

	// Update remote DB
	deleteContact(selectedContact);

	// Remove from DOM
	removeContactLink(selectedIndex);

	// Remove from local cache.
	contacts.splice(selectedContact, selectedContact);
}

function onClickCreate(e) {
	e.preventDefault();

	const contact = {
		"FirstName": document.getElementById("new-first-name").value,
		"LastName": document.getElementById("new-last-name").value,
		"PhoneNumber": document.getElementById("new-phone-number").value,
		"Address": document.getElementById("new-address").value,
		"City": document.getElementById("new-city").value,
		"State": document.getElementById("new-state").value,
		"ZIP": document.getElementById("new-zip").value,
		"UserID": id
	}

	// Update DB
	createContact(contact);

	// Update DOM
	populateContacts(true);
}

function displayContact(contact) {
	document.getElementById("info-fullname").innerHTML = contact.FirstName + " " + contact.LastName;
	document.getElementById("info-initials").innerHTML = contact["FirstName"][0] + contact["LastName"][0];
	document.getElementById("info-first-name").innerHTML = contact["FirstName"];
	document.getElementById("info-last-name").innerHTML = contact["LastName"];
	document.getElementById("info-phone-number").innerHTML = contact["PhoneNumber"];
	document.getElementById("info-address").innerHTML = contact["Address"];
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

/**
 * Requests all of a user's contacts, and pushes them onto the contacts list
 *
 * @param displayFirst whether or not we should automatically display the first user
 */
function populateContacts(displayFirst)
{
	// Clear all children of the contact holder
	let contactLanding = document.getElementById("contactLanding");
	while (contactLanding.firstChild)
		contactLanding.removeChild(contactLanding.firstChild);

	contacts = getContacts();
	contacts.forEach(appendContactLink);

	// Display first contact if requested.
	if (displayFirst) {
		displayContact(contacts[0]);
	}

}

/**
 * Removes contact like from DOM.
 *
 * @param i Index of the contact with respect to the local cache.
 */
function removeContactLink(i) {
	$(".list-group").children().each(function (index, link) {
		if ($(link).attr("index") === i) {
			$(link).remove();
		}
	})
}

/**
 * Appends a contact to the contact list
 *
 * @param contact The contact to be appended
 * @param i The index of the contact
 */
function appendContactLink(contact, i)
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

	// Add contact to local array store
	contacts.push(contact);

	let contactFirst = contact.FirstName;
	let contactLast = contact.LastName;
	let contactInitials = contactFirst[0] + contactLast[0];
	let contactFullName = contactFirst + " " + contactLast;

	let contactLanding = document.getElementById("contactLanding");

	let contactLink = document.createElement("a");
	contactLink.setAttribute("index", i);
	contactLink.style.color = "inherit";
	contactLink.className = "contact-link";

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

// Temporary service alert
function editSelectedContact()
{
	alert("We don't support this feature yet, check back later!");
}