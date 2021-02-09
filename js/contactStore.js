const contactBase = "LAMPAPI/contactController.php";
const searchBase = "LAMPAPI/searchContacts.php";

/**
 * A class used to encapsulate JSON-style error responses.
 */
class APIError extends Error {
    constructor(title, detail) {
        super(title);
        this.detail = detail;
    }
}

/**
 * Handles reponse given from server.
 *
 * @param response
 * @return {Promise<Response>}
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
}

/**
 * Updates the contact in the DB
 *
 * @param contact
 * @return {Promise<Response>}
 */
async function updateContact(contact) {
    return await fetch(contactBase, {
        method: "PUT",
        headers:  {"Content-Type": "application/json; charset=UTF-8"},
        body: JSON.stringify(contact)
    }).then(handleResponse);
}

/**
 * Fetches all contacts that match a keyword
 * 
 * @param keyword
 * @return {Promise<any>}
 */
async function searchContacts(keyword) {
    // Create api endpoint with userID encoded
    let url = searchBase + "?UserID=" + id + "&Keyword=" + keyword;

    return await fetch(url)
        .then((response) => response.json());
}

/**
 * Uploads a profile image for the given contact
 *
 * @param imageFile The image to use as a profile picture.
 * @param contactID The ID of the contact.
 * @return {Promise<Response>}
 */
async function uploadProfileImg(imageFile, contactID) {
    let formData = new FormData();
    formData.append("img", imageFile);
    formData.append("id", contactID);

    return await fetch("/LAMPAPI/profileImgUpload.php", {
        method: "POST",
        body: formData
    })
    .then(handleResponse);
}