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

// Removed so body is accepted
// Ensure it's a GET Request
// ensureGET();

// Create contact store
$store = new ContactStore($db);

// Accept request body
$userData = getRequestInfo();

applyJSONHeader();

// Make sure that the request body has all the required components.
if ($userData == null || !array_key_exists("Login", $userData) || !array_key_exists("Password", $userData)) {
    ErrorHandler::generic_error(new Error("Invalid Login or Password"));
    return;
}

// Make sure login is valid.
$result = $store->verifyLogin($userData["Login"], $userData["Password"]);

if (!$result || $result->num_rows < 1) {
    // Error out.
    ErrorHandler::generic_error(new Error("Invalid Username or Password",
        "Credentials could not be found"));
    return;
}

// Print response info
$user = $store->getUserByLogin($userData["Login"]);
if ($user == null) {
    ErrorHandler::generic_error(new Error("An unexpected Error Occurred", "User fetch failed."));
}

echo json_encode($user->toArray(), JSON_PRETTY_PRINT);
