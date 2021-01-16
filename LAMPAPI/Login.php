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

applyJSONHeader();

// Make sure that the request body has all the required components.
if ($inData == null || !array_key_exists("login", $inData) || !array_key_exists("password", $inData)) {
    ErrorHandler::generic_error(new Error("Invalid Login or Password"));
    return;
}

// Make sure login is valid.
$result = $store->verifyLogin($inData["login"], $inData["password"]);

if (!$result || $result->num_rows < 1) {
    // Error out.
    ErrorHandler::generic_error(new Error("Invalid Username or Password",
        "Credentials could not be found"));
    return;
}

// Print response info
$user = $result["user"];
echo json_encode($user->toArray(), JSON_PRETTY_PRINT);
