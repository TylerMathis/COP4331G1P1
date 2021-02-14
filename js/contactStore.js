import { handleResponse, jsonHeader } from "./APIUtil";
import { id } from "./user";

const contactBase = "LAMPAPI/contactController.php";
const searchBase = "LAMPAPI/searchContacts.php";

/**
 * @typedef {object} Contact
 * @property {string} FirstName
 * @property {string} LastName
 * @property {string} Email
 * @property {string} PhoneNumber
 * @property {string} State
 * @property {string} City
 * @property {string} ProfileImage
 * @property {int} ID
 * @property {int} UserID
 */

/**
 * Delete the given contact from the database.
 *
 * @param {Contact} contact The contact to delete
 * @return {Promise<Response>}
 */
async function deleteContact(contact) {

    // Create api endpoint with userID encoded
    let url = contactBase + "?ID=" + contact.ID;

    return await fetch(url, {
        method: "DELETE",
        headers: jsonHeader,
        body: JSON.stringify(contact)
    })
    .then(handleResponse);
}

/**
 * Fetches all the contacts for the given user.
 *
 * @return {Promise<Array.<Contact>>}
 */
async function getContacts() {
    // Create api endpoint with userID encoded
    let url = contactBase + "?UserID=" + id;

    return await fetch(url)
        .then(response => response.json());
}

/**
 * Creates a new user in the database.
 *
 * @param {Contact} contact
 * @return {Promise<number>}
 */
async function createContact(contact) {
    return await fetch(contactBase, {
        method: "POST",
        body: JSON.stringify(contact),
        headers: jsonHeader
    })
    .then(handleResponse)
    .then(response => response.json())
    .then(json => json.ID);
}

/**
 * Updates the contact in the DB
 *
 * @param {Contact} contact
 * @return {Promise<Response>}
 */
async function updateContact(contact) {
    return await fetch(contactBase, {
        method: "PUT",
        headers:  jsonHeader,
        body: JSON.stringify(contact)
    }).then(handleResponse);
}

/**
 * Fetches all contacts that match a keyword
 *
 * @param {string} keyword
 * @return {Promise<Array.<Contact>>}
 */
async function searchContacts(keyword) {
    // Create api endpoint with userID encoded
    let url = searchBase + "?UserID=" + id + "&Keyword=" + keyword;

    return await fetch(url)
        .then(response => response.json());
}

/**
 * Uploads a profile image for the given contact
 *
 * @param imageFile The image to use as a profile picture.
 * @param contactID The ID of the contact.
 * @return {Promise<any>}
 */
async function uploadProfileImg(imageFile, contactID) {
    let formData = new FormData();
    formData.append("img", imageFile);
    formData.append("id", contactID);

    return await fetch("/LAMPAPI/profileImgUpload.php", {
        method: "POST",
        body: formData
    })
    .then(handleResponse)
    .then(response => response.json());
}

// Export functions
export {createContact, deleteContact, getContacts, updateContact, uploadProfileImg, searchContacts};
