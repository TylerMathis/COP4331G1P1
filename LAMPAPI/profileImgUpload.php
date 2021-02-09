<?php
/**
 * Variable Includes:
 * @var Database $db
 */
include_once 'util.php';
include_once 'connection.php';
include_once 'ContactStore.php';
include_once "Error/ErrorHandler.php";
include_once "Error/Error.php";
include_once "util.php";

$store = new ContactStore($db);

$filename = basename($_FILES["img"]["name"]);
$ext = pathinfo($filename, PATHINFO_EXTENSION);
$uuid = uniqid();

$saveFilename = $uuid.".".$ext;
$savePath = "../contact-imgs/".$saveFilename;
move_uploaded_file($_FILES["img"]["tmp_name"], $savePath);

$store->saveProfileImg($saveFilename, $_POST["id"]);

echo json_encode(array("image" => $saveFilename));