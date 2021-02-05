const contactBase = "LAMPAPI/contactController.php"

class APIError extends Error {
    constructor(title, detail) {
        super(title);
        this.detail = detail;
    }
}

/**
 *
 * @param response
 * @return {{ok}|*}
 */
function errorHandler(response) {
    if (!response.ok) {
        return response.json().then(json => {throw new APIError(json.title, json.detail)});
    }

    return response;
}

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
 *
 * @return {Promise<*>}
 */
async function foo() {
    return await fetch("LAMPAPI/contactController.php")
        .then(errorHandler)
        .catch((error) => console.log(error));
}

/**
 * Creates a new user in the database.
 *
 * @param contact
 * @return {Promise<number>}
 */
async function createContact(contact) {

    return await fetch(contactBase, {
        method: "POST",
        body: JSON.stringify(contact),
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    .then(errorHandler)
    .then(response => response.json())
    .then(json => json.ID)
    .catch(error => {
        displayNotification(error.message, error.detail, "danger");
        return -1;
    });


    // // Valid creation
    // if (xhr.status === 201) {
    //     displayNotification("Success!", "Contact created", "success");
    //     return JSON.parse(xhr.responseText).ID;
    // } else { // Invalid Creation
    //     let error = JSON.parse(xhr.responseText);
    //     displayNotification(error.title, error.detail, "danger");
    // }
}

/**
 * Updates a contact in the database
 *
 * @param contact The new data in the contact
 */
function updateContact(contact) {
    // Create JSON payload and api endpoint
    let jsonPayload = JSON.stringify(contact);
    let url = urlBase + "contactController" + extension;

    // Send POST with our data to look up
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.send(jsonPayload);

    // Valid update
    if (xhr.status === 200) {
        displayNotification("Success!", "Contact updated", "success");
    } else { // Invalid Creation
        let error = JSON.parse(xhr.responseText);
        displayNotification(error.title, error.detail, "danger");
    }

    return -1;
}