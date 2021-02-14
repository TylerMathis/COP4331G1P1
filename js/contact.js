import { validateResponse, APIError } from "./APIUtil";
import { getContacts, updateContact, deleteContact,
	uploadProfileImg, createContact, searchContacts } from "./contactStore";
import { id } from "./user";
import { debounce } from "./debounce";
import { displayError, displayNotification } from "./design";

/**
 * Local store for all contacts
 * @type {Map<number, Contact>}
 */
let contacts = new Map;

/**
 * The currently select contact object.
 * @type {Contact}
 */
let selectedContact = undefined;

/**
 * The currently selected contact link.
 * @type {HTMLElement}
 */
let selectedLink = undefined;

/**
 * Stores comparators for sorting contacts.
 * @type {{firstName: (function(Contact, Contact): number), lastName: (function(Contact, Contact): number)}}
 */
const comparators = {
	firstName: (con1, con2) =>
		(con1.FirstName.toLowerCase() > con2.FirstName.toLowerCase()) ? 1 : -1,
	lastName: (con1, con2) =>
		(con1.LastName.toLowerCase() > con2.LastName.toLowerCase()) ? 1 : -1
};

/**
 * The currently selected sorting method.
 * @type {function(Contact, Contact): number}
 */
let selectedComparator = comparators.firstName;

// Create a functional parser object.
/**
 * Parses the data-contact-* dataset for a given element.
 *
 * @param {HTMLElement} element The element to parse
 * @return {{targetID: string, key: string}}
 */
const parser = element => ({
	key: element.dataset.contactKey,
	targetID: element.dataset.contactTarget
});

/**
 * Takes a profile container and updates it appropriately
 * for the given contect
 *
 * @param {Contact} contact
 * @param profileContainer
 */
function adaptProfileContainer(contact, profileContainer) {
	const imgHTML = $(profileContainer).find("img")[0];
	const h3HTML = $(profileContainer).find("h3")[0];

	if (contact.ProfileImage != null) {
		// Remove the text
		$(h3HTML).hide();
		// Add the image in
		$(imgHTML).show();
		$(imgHTML).attr("src", "contact-imgs/" + contact.ProfileImage);
	} else { // Image is not available.
		// Remove the image
		$(imgHTML).hide();
		// Add the text back
		$(h3HTML).show();
	}
}

/**
 * The debounced contact search funcion.
 *
 * @type {function(...string): void}
 */
const debouncedSearch = debounce(searchAndPopulate, 300);

/**
 * Simply prevents any defualt actions.
 *
 * @param e
 * @return {void|void|*}
 */
const preventer = e => e.preventDefault();

// Assign event handlers.
$(document).on("click", ".contact-link", onClickContact);
$(document).on("click", "#delete-btn", onClickDelete);
$(document).on("click", "#create-btn", onClickCreate);
$(document).on("click", "#edit-btn", onClickEdit);
$(document).on("input", "#search", onSearch);

// Drop events
$(document).on("drop", "#drop-area", onImgDrop);
$(document).on("dropover", "#drop-area", preventer);
$(document).on("dragleave", "#drop-area", preventer);
$(document).on("dragover", "#drop-area", preventer);

function onSearch() {
	// Run query.
	debouncedSearch($(this).val());
	// Show loading indicator
	displaySpinner();
}

function onImgDrop(e) {
	e.preventDefault();

	// Get data transfer
	e.dataTransfer = e.originalEvent.dataTransfer;
	var data = e.dataTransfer.getData("text/plain");
	const file =  e.dataTransfer.files[0];

	// Upload profile picture.
	uploadProfileImg(file, selectedContact.ID).then(json => {
		// Head intials html
		$(this).find("h3").hide();
		// Set the new image and show it
		$("#edit-profile-img").attr("src", "contact-imgs/" + json.image);
		$("#edit-profile-img").show();
		// Update selected contact.
		selectedContact.ProfileImage = json.image;
	});
}

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
		displayNotification("Success!", "Contact deleted", "success");
	})
	.catch(displayError)
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
	data.append("image", $('input[type=file]')[0].files[0]);
	console.log(...data.entries());

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
		.catch(displayError)
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

	console.log(...data.entries());

	// Merge form data
	const contact = selectedContact;
	data.forEach(function (value, key) {
		if (!(value === "" || value === "Choose..."))
			contact[key] = value;
	});

	updateContact(contact).then(() => {
		// Update DOM
		removeContactLink(contact.ID);
		// Sort new contact into list.
		insertNewContact(contact);
		// Display success
		displayNotification("Success!", "Contact Updated", "success")
	})
	.catch(displayError)
	.finally(() => {
		// Hide modal
		$("#editModal").modal("hide");
	});
}

/**
 * Selects a contact by it's index in the DOM
 *
 * @param {int} index The index of the contact to be selected
 */
function selectByIndex(index) {
	let contactLanding = document.getElementById("contactLanding");
	let contactLinks = contactLanding.children;
	if (contactLinks[index] !== undefined)
		changeSelectedTo(contactLinks[index]);
}

/**
 * Selects a contact in the DOM by it's id
 *
 * @param {int} id The ID to be selected.
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
 * @param {HTMLElement} contactLink The link to be selected.
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

/**
 * Selects the link
 *
 * @param {HTMLElement} contactLink
 */
function select(contactLink) {
	contactLink.querySelector(".list-group-item").classList.add("active");
}

/**
 * Deselects the link
 *
 * @param {HTMLElement} contactLink
 */
function deselect(contactLink) {
	contactLink.querySelector(".list-group-item").classList.remove("active");
}

/**
 * Displays the contact information for the given contact.
 *
 * @param {Contact} contactRef The contact to display
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

		$(data.targetID).html(contact[data.key]);
	});

	// Update edit DOM
	$("#edit-form [data-contact-key][data-contact-target]").each(function (i, element) {
		const data = parser(element);

		// Check if input or select
		const input = element.querySelector("input");
		const select = element.querySelector("select");
		const initials = element.querySelector("h3");

		// Reset the fields
		if (input && !initials) {
			input.placeholder = (contact[data.key] != null) ? contact[data.key] : "";
			input.value = "";
		} else if (select) {
			select.selectedIndex = 0;
		} else {
			initials.innerHTML= contact[data.key];
		}

	});

	const container = $("#contact-profile-container");
	const editContainer = $("#drop-area");

	// Populate image
	adaptProfileContainer(contact, container);
	adaptProfileContainer(contact, editContainer);
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
 * @param {Contact[]} contactsArr An array of contacts to be populated.
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

	populateContactImages();

	$(".loading-overlay").fadeOut({
		speed: "slow",
		easing: "linear"
	});
}

/**
 * Gets all contacts and sends them to populateContacts
 */
function getAllContacts() {
	// Fetch the contacts array.
	getContacts().then(contacts => {
		// If there are no contacts to be sorted, then terminate early
		if (contacts.length === 0) {
			$(".loading-overlay").fadeOut({
				speed: "slow",
				easing: "linear"
			});
			return;
		}
		// Sort by first name (default).
		const sorted = contacts.sort(selectedComparator);
		// Send the sorted array to populate contacts.
		populateContacts(sorted);
		// Select the first contact by default
		selectByIndex(0);
	});
}

/**
 * Searches contacts and repopulates the DOM
 *
 * @param {string} keyword The keyword to search on.
 */
function searchAndPopulate(keyword) {
	// If the field is empty, then grab all contacts and remove loader.
	if (keyword === "") {
		getAllContacts();
		hideSpinner();
		return;
	}

	// Otherwise, search.
	searchContacts(keyword).then(contacts => {
		// Sort
		const sorted = contacts.sort(selectedComparator);
		console.log(contacts);
		// Send the sorted array to populate contacts.
		populateContacts(sorted);
		// Select the first contact by default
		selectByIndex(0);
		// Remove loading indicator on completion.
		hideSpinner();
	});
}

/**
 * Inserts and sorts the new contact into the contact list.
 *
 * @param {Contact} contact The contact to be inserted.
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
 * @param {int} id ID of the contact.
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
 * @param {Contact} contact The contact to be appended
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

	let profileContent = `<h3 class="profile-ab">${contactInitials}</h3>`;
	let hasImg = false

	if (contact.ProfileImage != null) {
		profileContent = `<img data-contact-img="contact-imgs/${contact.ProfileImage}" class="profile-img">`;
		hasImg = true;
	}

	// Set HTML
	contactLink.innerHTML = `
	<div class="list-group-item d-flex contact-card">
		<div class="profile-icon d-flex justify-content-center align-self-center">
			<div class="align-self-center" style="width: 100%;">
					${profileContent}
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

/**
 * Populates the images for all the contacts.
 */
function populateContactImages() {
	$("img[data-contact-img]").each(function() {
		$(this).attr("src", $(this).attr("data-contact-img"));
	})
}

/**
 * Displays loading spinner.
 */
function displaySpinner() {
	// Hide list
	$("#contactLanding").hide();

	// Show load overlay
	$("#load-overlay").show()
}

/**
 * Hides loading spinner.
 */
function hideSpinner() {
	// Show list
	$("#contactLanding").show();

	// Hide load overlay
	$("#load-overlay").hide();

}

export { getAllContacts }
