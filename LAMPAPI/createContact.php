<?php
/**
 * Variable Includes:
 * @var Database $db
 */
include_once 'util.php';
include_once 'connection.php';
include_once 'ContactStore.php';

use Contactical\ErrorHandler;
use Contactical\Error;

// Initialize store.
$store = new ContactStore($db);

// Make sure it's a post request
ensurePOST();

// Fetch request body.
$contactData = getRequestInfo();

applyJSONHeader();

// Make sure all required components are available.
if ($contactData == null || !array_key_exists("FirstName", $contactData)
    || !array_key_exists("LastName", $contactData)
    || !array_key_exists("PhoneNumber", $contactData)
    || !array_key_exists("Address", $contactData)
    || !array_key_exists("City", $contactData)
    || !array_key_exists("State", $contactData)
    || !array_key_exists("ZIP", $contactData)) {

    ErrorHandler::generic_error(new Error("Missing required data",
        "One or more required pieces of data are not present."));
    return;
}

// Create user in DB
$result = $store->createContact($contactData);

if (!$result["result"]) { // Unknown error
    ErrorHandler::generic_error(new Error("Account could not be created", "Please try again."));
    return;
}

// Indicate success response
http_response_code(201);
