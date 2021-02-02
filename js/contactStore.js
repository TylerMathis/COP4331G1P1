/**
 * Deletes the given contact from the database.
 *
 * @param contact Contact to delete.
 */
function deleteContact(contact) {
    // Create api endpoint with userID encoded
    let url = urlBase + "contactController" + extension;
    url += "?ID=" + contact.ID;

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
}

/**
 * Retrieves all contacts from database
 *
 * @returns {any|undefined}
 */
function getContacts() {
    // Create api endpoint with userID encoded
    let url = urlBase + "contactController" + extension;
    url += "?UserID=" + id;

    // Send POST with our data to look up
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send();

    let result = JSON.parse(xhr.responseText);
    if (result.length === undefined) return undefined;

    return result;
}

/**
 * Creates a new contact in the DB
 *
 * @param contact The contact to add.
 */
function createContact(contact) {
    // Create JSON payload and api endpoint
    let jsonPayload = JSON.stringify(contact);
    let url = urlBase + "contactController" + extension;

    // Send POST with our data to look up
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(jsonPayload);

    // Valid creation
    if (xhr.status === 201) {
        displayNotification("Success!", "Contact created", "success");
    } else { // Invalid Creation
        let error = JSON.parse(xhr.responseText);
        displayNotification(error.title, error.detail, "danger");
    }
}