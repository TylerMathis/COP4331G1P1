<?php
/**
 * @var Database $db
 */
include_once 'connection.php';
include_once 'ContactStore.php';
include_once 'Error.php';

use Contactical\Error;

// Class Variables
$inData = getRequestInfo();
$store = new ContactStore($db);

// Set headers
header('Content-type: application/json');

if ($inData == null || !array_key_exists("login", $inData) || !array_key_exists("password", $inData)) {
    Error::generic_error("No credentials provided.");
    return;
}

$result = $store->verify_login($inData["login"], $inData["password"]);

if ($result["user"] == null)
{
    // Error out.
    Error::generic_error($result["message"]);
    return;
}

// Otherwise print response info
$user = $result["user"];
echo json_encode($user->toArray(), JSON_PRETTY_PRINT);
	
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}
	
function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}
	
function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}
	
