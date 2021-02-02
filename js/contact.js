// Local store for all contacts
let contacts = new Map;
let selectedContact = undefined;

// Assign event handlers.
$(document).on("click", ".contact-link", onClickContact);
$(document).on("click", "#delete-btn", onClickDelete);
$(document).on("click", "#create-btn", onClickCreate);

function onClickContact(e) {
	e.preventDefault();

	// Capture contact ID from DOM
	const contactID = $(this).data("contact-id");

	// Fetch contact from local cache.
	const contact = contacts.get(contactID);
	displayContact(contact);
}

function onClickDelete(e) {
	e.preventDefault();

	console.log(selectedContact);

	// Update remote DB
	deleteContact(selectedContact);

	// Remove from DOM
	removeContactLink(selectedContact.ID);
}

function onClickCreate(e) {
	e.preventDefault();

	// Fetch DOM and serialize
	const form = document.getElementById("editForm");
	const data = new FormData(form);

	// Get Form Data
	const contact = {};
	data.forEach(function (value, key) {
		contact[key] = value;
	});

	console.log(contact);

	// Update DB and assign ID's
	contact.UserID = id;
	contact.ID = createContact(contact);

	// Update DOM
	appendContactLink(contact);
}

function displayContact(contact) {

	// Update selected index.
	selectedContact = contact;

	document.getElementById("info-fullname").innerHTML = contact.FirstName + " " + contact.LastName;
	document.getElementById("info-initials").innerHTML = contact.FirstName[0] + contact["LastName"][0];
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

	const fetchedContacts = getContacts();

	// Hash values into map
	fetchedContacts.forEach(function (contact) {
		contacts.set(contact.ID, contact);
	});

	contacts.forEach(appendContactLink);

	// Display first contact if requested.
	if (displayFirst) {
		displayContact(contacts.entries().next().value[1]);
	}

}

/**
 * Removes contact like from DOM.
 *
 * @param id ID of the contact.
 */
function removeContactLink(id) {
	$(".list-group").children().each(function (index, link) {
		if ($(link).data("contact-id") === id) {
			$(link).remove();
		}
	});

	// Delete from local cache.
	contacts.delete(id);
}

/**
 * Appends a contact to the contact list
 *
 * @param contact The contact to be appended
 */
function appendContactLink(contact)
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
	contacts.set(contact.ID, contact);

	let contactFirst = contact.FirstName;
	let contactLast = contact.LastName;
	let contactInitials = contactFirst[0] + contactLast[0];
	let contactFullName = contactFirst + " " + contactLast;

	let contactLanding = document.getElementById("contactLanding");

	let contactLink = document.createElement("a");

	// Add associated data
	contactLink.dataset.contactId = contact.ID;
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