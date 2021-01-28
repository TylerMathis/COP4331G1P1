<?php
/**
 * Variable Includes:
 * @var Database $db
 */
include_once 'util.php';
include_once 'connection.php';
include_once 'UserStore.php';

define("SQL_DUPE_UNI", 1062);

use Contactical\ErrorHandler;
use Contactical\Error;

// Initialize store.
$store = new UserStore($db);

// Make sure it's a post request
ensurePOST();

// Fetch request body.
$userData = getRequestInfo();

applyJSONHeader();

// Make sure all required components are available.
if ($userData == null || !array_key_exists("FirstName", $userData)
    || !array_key_exists("LastName", $userData)
    || !array_key_exists("Login", $userData)
    || !array_key_exists("Password", $userData)) {

    ErrorHandler::generic_error(new Error("Missing required data",
        "One or more required pieces of data are not present."));
    return;
}

// Create user in DB
$result = $store->createUser($userData);

// Check if it's duplicated.
if ($result->error == SQL_DUPE_UNI) {
    ErrorHandler::generic_error(new Error("Account already exists",
        "Another account with the same login already exists.", 409));
    return;
} else if (!$result->num_rows === 0) { // If not some other error occurred.
    ErrorHandler::generic_error(new Error("Account could not be created", "Please try again."));
    return;
}

// Indicate success response
http_response_code(201);
