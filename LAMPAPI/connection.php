<?php
include_once 'secret.php';
include_once 'Database.php';

/*
 * You should define the credentials for the SQL server,
 * secret.php should be created and should fit the needs of your
 * local SQL setup. It will automatically be gitignored.
*/

/* Place in secret.php using your credentials:

// Database Hostname
define("SQL_HOST", "127.0.0.1");

// Database Username
define("SQL_LOGIN", "username");

// Database Password
define("SQL_PASS", "password");

// Database Schema
define("SQL_DB", "COP4331");
*/

if (!defined("SQL_LOGIN") || !defined("SQL_PASS") || !defined("SQL_HOST") || !defined("SQL_DB")) {
    echo "Please define SQL credentials in the secret.php file!";
    die(1);
}

// Create persistent instance of database
$db = new Database(SQL_LOGIN, SQL_PASS, SQL_HOST, SQL_DB);