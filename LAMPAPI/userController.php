<?php
/**
 * Includes
 * @var Database $db
 */
include_once "connection.php";
include_once "Error/ErrorHandler.php";
include_once "Error/Error.php";
include_once "util.php";
include_once "ContactStore.php";

use Contactical\Error;
use Contactical\ErrorHandler;

// Initialize Store
$store = new ContactStore($db);
applyJSONHeader();

switch ($_SERVER["REQUEST_METHOD"]) {
    case "POST": // Uses JSON encoding
        createContact();
        break;
    case "GET": // Uses URL encoding
        getContacts();
        break;
    case "DELETE": // Uses URL encoding
        deleteContact();
        break;
    case "PUT": // Uses JSON encoding.
        updateContact();
        break;
}

function createContact()
{
    // Precondition
    verifyFields(array("FirstName", "LastName", "Email", "Address"));

    global $store;
    $result = $store->createContact(Contact::fromArray(getRequestInfo()));

    if (!$result) {
        ErrorHandler::generic_error(new Error("Contact could not be created", "Please try again later."));
        return;
    }

    // Indicate success response
    http_response_code(201);
}

function getContacts()
{
    verifyFields(array("UserID"));

    global $store;
    $result = $store->getContactsForUser(getRequestInfo()["UserID"]);

    if (!$result) {
        ErrorHandler::generic_error(new Error("Contacts could not be fetched", "Please try again later."));
    }

    $retVal = array();

    /** @var Contact $contactData */
    foreach ($result as $contactData) {
        array_push($retVal, $contactData->toArray());
    }

    echo json_encode($retVal);
}

function deleteContact() {
    verifyFields(array("ID"));

    global $store;
    $result = $store->deleteContact(getRequestInfo()["ID"]);

    if (!$result) {
        ErrorHandler::generic_error(new Error("Contacts could not be deleted", "Please try again later."));
    }

    http_response_code(200);
}

function updateContact() {
    // Precondition
    verifyFields(array("ID", "FirstName", "LastName", "PhoneNumber", "Address"));

    global $store;
    $result = $store->updateContact(Contact::fromArray(getRequestInfo()));

    if (!$result) {
        ErrorHandler::generic_error(new Error("Contacts could not be updated", "Please try again later."));
    }

    http_response_code(200);
}




