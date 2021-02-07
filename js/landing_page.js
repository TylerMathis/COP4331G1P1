/**
 * A map storing html ID -> html files
 * for populating modal HTML.
 *
 * @type {Map<string, string>}
 */
const modalMap = new Map([
    ["#edit-modal-prop", "modal/editModal.html"],
    ["#delete-modal-prop", "modal/deleteModal.html"],
    ["#new-modal-prop", "modal/createModal.html"]
]);

// Populate local user data, and welcome them
window.onload = () => {
    // Make all modals are loaded before doing anything.
    $.when.apply($, loadModals())
        .done(initialize());
};

/**
 * The over-arching function to prepare the landing page.
 */
function initialize() {
    // Get user data and welcome them
    populateUserCache();
    welcomeUser();

    // Fetch the contacts array.
    getContacts().then(contacts => {
        // If there are no contacts to be sorted, then terminate early
        if (contacts.length === 0) {
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
 * Populates the modal html in on load so it doesn't clutter the base html.
 */
function loadModals() {
    const promises = [];
    modalMap.forEach((value, key) => {
        promises.push($.get(value, data => $(key).append(data)));
    });

    return promises;
}