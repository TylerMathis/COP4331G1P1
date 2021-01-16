<?php

include_once "Error/Error.php";
include_once "Error/ErrorHandler.php";

use Contactical\Error;
use Contactical\ErrorHandler;

/**
 * Gets the body from the request and parses it as a JSON file.
 *
 * @return mixed
 */
function getRequestInfo() {
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