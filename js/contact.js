// Local store for all contacts
let contacts = new Map;
let selectedContact = undefined;
let selectedLink = undefined;

// Create and store comparators
const comparators = {
	firstName: (con1, con2) => (con1.FirstName.toLowerCase() > con2.FirstName.toLowerCase()) ? 1 : -1,
	lastName: (con1, con2) => (con1.LastName.toLowerCase() > con2.LastName.toLowerCase()) ? 1 : -1
};

// Assign the default selected comparator
let selectedComparator = comparators.firstName;

// Create a functional parser object.
const parser = element => ({
	key: element.dataset.contactKey,
	targetID: element.dataset.contactTarget
});

// Assign event handlers.
$(document).on("click", ".contact-link", onClickContact);
$(document).on("click", "#delete-btn", onClickDelete);
$(document).on("click", "#create-btn", onClickCreate);
$(document).on("click", "#edit-btn", onClickEdit);

function onClickContact(e) {
	e.preventDefault();

	// Select self.
	changeSelectedTo(this);
}

function onClickDelete(e) {
	e.preventDefault();

	// Update remote DB
	deleteContact(selectedContact).then(() => {
		// Remove from DOM
		removeContactLink(selectedContact.ID);
		displayNotification("Success", "Contact deleted", "info");
	})
	.catch(handleError)
	.finally(() => $("#deleteModal").modal("hide"));

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
	createContact(contact)
		.then(ID => {
			// Update ID
			contact.ID = ID;
			// Insert and update the DOM.
			insertNewContact(contact);
			// Display notification
			displayNotification("Success!", "Contact created", "success");
		})
		.catch(handleError)
		.finally(() => {
			// Dismiss modal
			$("#newModal").modal("hide");
			// Clear the modal for next time
			clearCreate();
		});
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

	updateContact(contact).then(() => {
		// Update DB
		updateContact(contact);
		// Update DOM
		removeContactLink(contact.ID);
		// Sort new contact into list.
		insertNewContact(contact);
	})
	.catch(handleError)
	.finally(() => {
		// Hide modal
		$("#editModal").modal("hide");
	});
}

function handleError(error) {
	displayNotification(error.message, error.detail, "danger");
}

/**
 * Selects a contact by it's index in the DOM
 *
 * @param index The index of the contact to be selected
 */
function selectByIndex(index) {
	let contactLanding = document.getElementById("contactLanding");
	let contactLinks = contactLanding.children;
	changeSelectedTo(contactLinks[index]);
}

/**
 * Selects a contact in the DOM by it's id
 *
 * @param id The ID to be selected.
 */
function selectById(id) {
	$(".list-group").children().each(function (index, link) {
		if ($(link).data("contact-id") === id) {
			changeSelectedTo(link);
			return;
		}
	});
}

/**
 * Removes previous selection, and selects the current link.
 *
 * @param contactLink The link to be selected.
 */
function changeSelectedTo(contactLink) {
	// Capture contact ID from DOM.
	const contactID = $(contactLink).data("contact-id");

	// Fetch contact from local cache.
	const contact = contacts.get(contactID);

	// Deselect old link.
	if (selectedLink !== undefined) {
		deselect(selectedLink);
	}

	// Update selected contact.
	selectedContact = contact;

	// Update selected link.
	selectedLink = contactLink;
	select(selectedLink);

	// Display our chosen contact.
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

	// Update info DOM
	$("#info-pane [data-contact-key][data-contact-target]").each(function (i, element) {
		const data = parser(element);
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

	// Update create DOM
	$("#new-form [data-contact-key][data-contact-target]").each(function (i, element) {
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
 * Pushes list of contacts to the DOM and contacts map.
 *
 * @param contactsArr An array of contacts to be populated.
 */
function populateContacts(contactsArr) {
	// Clear all children of the contact holder
	const contactLanding = document.getElementById("contactLanding");
	while (contactLanding.firstChild) {
		contactLanding.removeChild(contactLanding.firstChild);
	}

	// Clear contacts map
	contacts.clear();

	// Append all contact links, and populate map
	contactsArr.forEach(function (contact) {
		contacts.set(contact.ID, contact);
		appendContactLink(contact);
	});
}

/**
 * Inserts and sorts the new contact into the contact list.
 *
 * @param contact The contact to be inserted.
 */
function insertNewContact(contact) {
	// Turn contact map into array for sorting.
	let contactArr = [...contacts].map(([id, content]) => (content));

	// Add new contact onto array.
	contactArr.push(contact);

	// Sort!
	contactArr.sort(selectedComparator);

	// Populate new contact order.
	populateContacts(contactArr);

	// Select the newly created contact.
	selectById(contact.ID);
}

/**
 * Removes contact like from DOM.
 *
 * @param id ID of the contact.
 */
function removeContactLink(id) {
	// Delete from local cache.
	contacts.delete(id);

	$(".list-group").children().each(function (index, link) {
		if ($(link).data("contact-id") === id) {
			$(link).remove();
			return;
		}
	});
}

/**
 * Appends a contact to the contact list, and selects it.
 *
 * @param contact The contact to be appended
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
			<h5 class="contact-name" style="text-align: center; margin: 0; width: 100%; cursor: pointer">${contactFullName}</h5>
    	</div>
    </div>`

	// Add associated data
	contactLink.dataset.contactId = contact.ID;
	contactLink.style.color = "inherit";
	contactLink.className = "contact-link";

	contactLanding.appendChild(contactLink);

	// Select the contact.
	changeSelectedTo(contactLink);
}