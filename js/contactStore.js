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
function handleResponse(response) {
    if (!response.ok) {
        return response.json().then(json => {throw new APIError(json.title, json.detail)});
    }

    return response;
}

/**
 * Delete the given contact from the database.
 * @param contact The contact to delete
 *
 * @return {Promise<Response>}
 */
async function deleteContact(contact) {

    // Create api endpoint with userID encoded
    let url = contactBase + "?ID=" + contact.ID;

    return await fetch(url, {
        method: "DELETE",
        headers: {"Content-Type": "application/json; charset=UTF-8"},
        body: contact
    })
    .then(handleResponse);

    // // Send DELETE with our contact to delete
    // let xhr = new XMLHttpRequest();
    // xhr.open("DELETE", url, false);
    // xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // xhr.send();
    //
    // if (xhr.status === 200) {
    //     displayNotification("Success", "Contact deleted", "info");
    // }
    // else {
    //     let error = JSON.parse(xhr.responseText);
    //     displayNotification(error.title, error.detail, "danger");
    // }
}

/**
 * Fetches all the contacts for the given user.
 *
 * @return {Promise<any>}
 */
async function getContacts() {
    // Create api endpoint with userID encoded
    let url = contactBase + "?UserID=" + id;

    return await fetch(url)
        .then((response) => response.json());
}

/**
 *
 * @return {Promise<*>}
 */
async function foo() {
    return await fetch("LAMPAPI/contactController.php")
        .then(handleResponse);
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
    .then(handleResponse)
    .then(response => response.json())
    .then(json => json.ID);
    // .catch(error => {
    //     displayNotification(error.message, error.detail, "danger");
    //     return -1;
    // });
}

/**
 * Updates a contact in the database
 *
 * @param contact The new data in the contact
 */
async function updateContact(contact) {
    return await fetch(contactBase, {
        method: "PUT",
        headers:  {"Content-Type": "application/json; charset=UTF-8"},
        body: JSON.stringify(contact)
    })
    .then(handleResponse)
    .then(() => displayNotification("Success", "Contact Updated", "success"));
}