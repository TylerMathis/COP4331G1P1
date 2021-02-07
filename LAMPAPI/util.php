<?php

include_once "Error/Error.php";
include_once "Error/ErrorHandler.php";

use Contactical\Error;
use Contactical\ErrorHandler;

/**
 * Gets the data from the request.
 *
 * @return mixed
 */
function getRequestInfo() {

    $requestType = $_SERVER["REQUEST_METHOD"];

    if ($requestType == "GET" || $requestType == "DELETE") {
        return $_GET;
    }

    return json_decode(file_get_contents('php://input'), true);
}

/**
 * Makes sure we're using a GET request.
 */
function ensureGET() {
    if ($_SERVER['REQUEST_METHOD'] != "GET") {
        ErrorHandler::generic_error(new Error("Invalid Request Method. Please use GET."));
    }
}

/**
 * Makes sure we're using a POST request.
 */
function ensurePOST() {
    if ($_SERVER['REQUEST_METHOD'] != "POST") {
        ErrorHandler::generic_error(new Error("Invalid Request Method. Please use POST."));
    }
}

/**
 * Applies the JSON header to the content.
 */
function applyJSONHeader() {
    // Set headers to JSON
    header('Content-type: application/json');
}

/**
 * Verifies the given fields are in the request and does a fast-fail if not.
 *
 * @param array $fields
 */
function verifyFields($fields)
{
    $error = new Error("Missing fields in request.", "One or more required fields are missing");

    $request = getRequestInfo();
    
    if ($request == $_GET) {
        foreach ($fields as $field) {
            if (!array_key_exists($field, $request)) {
                ErrorHandler::generic_error($error);
            }
        }
    }

    if ($fields == null || count($request) < count($fields)) {
        ErrorHandler::generic_error($error);
    }

    foreach ($fields as $field) {
        if (!array_key_exists($field, $request)) {
            ErrorHandler::generic_error($error);
        }
    }
}