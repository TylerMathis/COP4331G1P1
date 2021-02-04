// Local store for all contacts
let contacts = new Map;
let selectedContact = undefined;
let selectedLink = undefined;

// Assign event handlers.
$(document).on("click", ".contact-link", onClickContact);
$(document).on("click", "#delete-btn", onClickDelete);
$(document).on("click", "#create-btn", onClickCreate);
$(document).on("click", "#edit-btn", onClickEdit);

function onClickContact(e) {
	e.preventDefault();

	// Capture contact ID from DOM
	const contactID = $(this).data("contact-id");

	// Fetch contact from local cache.
	const contact = contacts.get(contactID);

	console.log(contact);

	// Deselect old link
	if (selectedLink !== undefined) {
		deselect(selectedLink);
	}

	// Update selected index.
	selectedContact = contact;

	// Update selected link;
	selectedLink = this;
	select(selectedLink);

	displayContact(contact);
}

function onClickDelete(e) {
	e.preventDefault();

	// Update remote DB
	deleteContact(selectedContact);

	// Remove from DOM
	removeContactLink(selectedContact.ID);
}

function onClickCreate(e) {
	e.preventDefault();

	// Fetch DOM and serialize
	const form = document.getElementById("new-form");

	// Validate all fields
	if (form.checkValidity() === false) {
		form.classList.add("was-validated");
		return;
	}

	// Dismiss form
	$("#newModal").modal("hide");

	// Get form data
	const data = new FormData(form);

	// Populate contact
	const contact = {};
	data.forEach(function (value, key) {
		if (value === "" || value === "Choose...")
			contact[key] = null;
		else
			contact[key] = value;
	});

	// Update DB and assign ID's
	contact.UserID = id;
	contact.ID = createContact(contact);

	// Update DOM
	if (selectedLink)
		deselect(selectedLink);
	selectedLink = appendContactLink(contact);
	select(selectedLink);
	displayContact(contact);

	// Clear the modal for next time
	clearCreate();
}

function onClickEdit(e) {
	e.preventDefault();

	// Fetch DOM and serialize
	const form = document.getElementById("edit-form");
	const data = new FormData(form);

	// Merge form data
	const contact = selectedContact;
	data.forEach(function (value, key) {
		if (!(value === "" || value === "Choose..."))
			contact[key] = value;
	});

	// Update DB
	updateContact(contact);

	// Update DOM
	removeContactLink(contact.ID);
	selectedLink = appendContactLink(contact);
	select(selectedLink);
	displayContact(contact);
}

function select(contactLink) {
	contactLink.querySelector(".list-group-item").classList.add("active");
}

function deselect(contactLink) {
	contactLink.querySelector(".list-group-item").classList.remove("active");
}

/**
 * Displays the contact information for the given contact.
 *
 * @param contactRef The contact to display
 */
function displayContact(contactRef) {
	// Create a copy of the pass-by-reference parameter.
	const contact = Object.assign({}, contactRef);

	// Add auxiliary information
	contact.FullName = contact.FirstName + " " + contact.LastName;
	contact.Initials = contact.FirstName[0] + contact.LastName[0];

	// Create a functional parser object.
	const parser = element =>
		({
			key: element.dataset.contactKey,
			targetID: element.dataset.contactTarget
		});

	// Update info DOM
	$("#info-pane [data-contact-key][data-contact-target]").each(function (i, element) {
		const data = parser(element);
		console.log(element);
		if (data.key === "") {
			element.style.display = "none";
		} else {
			element.style.removeProperty("display");
		}

		$(data.targetID).text(contact[data.key]);
	});

	// Update edit DOM
	$("#edit-form [data-contact-key][data-contact-target]").each(function (i, element) {
		const data = parser(element);

		// Check if input or select
		const input = element.querySelector("input");
		const select = element.querySelector("select");

		// Reset the fields
		if (input) {
			input.placeholder = contact[data.key];
			input.value = "";
		} else if (select) {
			select.selectedIndex = 0;
		}

	});
}

/**
 * Clears all fields in the create modal
 */
function clearCreate() {

	// Remove validation
	document.getElementById("new-form").classList.remove("was-validated");

	// Create a functional parser object.
	const parser = element =>
		({
			key: element.dataset.contactKey,
			targetID: element.dataset.contactTarget
		});

	// Update create DOM
	$("#new-form [data-contact-key][data-contact-target]").each(function (i, element) {
		const data = parser(element);

		// Check if input or select
		const input = element.querySelector("input");
		const select = element.querySelector("select");

		// Reset the fields
		if (input) {
			input.value = "";
		} else if (select) {
			select.selectedIndex = 0;
		}
	});
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
		appendContactLink(contact);
	});

	// Display first contact if requested.
	if (displayFirst && contacts.size > 0) {
		selectedContact = contacts.entries().next().value[1]
		selectedLink = contactLanding.firstChild;
		select(contactLanding.firstChild);
		displayContact(selectedContact);
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
 * @returns contactLink The contactLink created
 */
function appendContactLink(contact) {

	// Add contact to local array store
	contacts.set(contact.ID, contact);

	let contactFirst = contact.FirstName;
	let contactLast = contact.LastName;
	let contactInitials = contactFirst[0] + contactLast[0];
	let contactFullName = contactFirst + " " + contactLast;

	let contactLanding = document.getElementById("contactLanding");
	let contactLink = document.createElement("a");

	// Set HTML
	contactLink.innerHTML = `
	<div class="list-group-item d-flex contact-card" style="min-height: 50px;">
		<div class="profile-icon d-flex justify-content-center align-self-center">
			<div class="align-self-center" style="width: 100%;">
				<h3 class="profile-ab">${contactInitials}</h3>
			</div>
		</div>
		<div class="d-flex align-items-center justify-content-center w-100" style="padding: 5px;">
			<h5 style="text-align: center; margin: 0; width: 100%; cursor: pointer">${contactFullName}</h5>
    	</div>
    </div>`

	// Add associated data
	contactLink.dataset.contactId = contact.ID;
	contactLink.style.color = "inherit";
	contactLink.className = "contact-link";

	contactLanding.appendChild(contactLink);

	return contactLink;
}