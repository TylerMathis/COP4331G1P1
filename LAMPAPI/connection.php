<?php
include_once 'secret.php';
include_once 'Database.php';

if (!defined("SQL_LOGIN") || !defined("SQL_PASS") || !defined("SQL_HOST") || !defined("SQL_DB")) {
    echo "Please define SQL credentials in the secret.php file!";
    die(1);
}

// Create persistent instance of database
$db = new Database(SQL_LOGIN, SQL_PASS, SQL_HOST, SQL_DB);