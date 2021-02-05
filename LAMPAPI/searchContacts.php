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

$store = new ContactStore($db);

// Ensure method type is correct.
ensureGET();
applyJSONHeader();

// Make sure fields are good.
verifyFields(array("UserID", "Keyword"));

$parameters = getRequestInfo();
$id = $parameters["UserID"];
$keyword = $parameters["Keyword"];

$result = $store->searchContact($id, $keyword);

// If there was an error just return an empty array.
if (!$result) {
    echo json_encode(array());
    die(1);
}

$retVal = array();

/** @var Contact $contactData */
foreach ($result as $contactData) {
    array_push($retVal, $contactData->toArray());
}

echo json_encode($retVal);

