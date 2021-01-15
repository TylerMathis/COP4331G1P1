<?php
/**
 * Variable Includes:
 * @var Database $db
 */
include_once 'connection.php';
include_once 'ContactStore.php';
include_once 'Error/ErrorHandler.php';
include_once 'Error/Error.php';
include_once 'util.php';

use Contactical\ErrorHandler;
use Contactical\Error;

// Ensure it's a GET Request
ensureGET();

// Class Variables
$inData = getRequestInfo();
$store = new ContactStore($db);

// Set headers to JSON
header('Content-type: application/json');

// Make sure that the request body has all the required components.
if ($inData == null || !array_key_exists("login", $inData) || !array_key_exists("password", $inData)) {
    ErrorHandler::generic_error(new Error("Invalid Login or Password"));
    return;
}

// Make sure login is valid.
$result = $store->verify_login($inData["login"], $inData["password"]);

if ($result["error"] != null) {
    // Error out.
    ErrorHandler::generic_error($result["error"]);
    return;
}

// Print response info
$user = $result["user"];
echo json_encode($user->toArray(), JSON_PRETTY_PRINT);
