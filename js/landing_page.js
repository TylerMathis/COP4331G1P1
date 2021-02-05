// Populate local user data, and welcome them
window.onload = function () {
    $.ajaxSetup({
        async: false
    });
    populateUserCache();
    welcomeUser();
    populateModals();
    retrieveContacts();
};

/**
 * Populates the modal html in on load so it doesn't clutter the base html.
 */
function populateModals() {
    $("#edit-modal-prop")   .load("../modal/editModal.html");
    $("#delete-modal-prop") .load("../modal/deleteModal.html");
    $("#new-modal-prop")    .load("../modal/createModal.html");
}

/**
 * Retrieves and sorts contacts by first name, then sends them to populateContacts.
 */
function retrieveContacts() {
    // Fetch the contacts array.
    const contactsArr = getContacts(id);

    // If there are no contacts to be sorted, then terminate early
    if (contactsArr.length === 0)
        return;

    // Sort by first name (default).
    const sorted = contactsArr.sort(comparators[selectedComparator]);

    // Send the sorted array to populate contacts.
    populateContacts(sorted);

    // Select the first contact by default
    selectByIndex(0);
}