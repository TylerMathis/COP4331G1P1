import {populateUserCache, welcomeUser} from "./user";
import {getAllContacts} from "./contact";
import {doLogout} from "./user";

// Populate local user data, and welcome them
window.onload = () => {
    // Get user data and welcome them
    populateUserCache();
    welcomeUser();
    getAllContacts();
};

$(document).on("click", "#logout-link", doLogout);
