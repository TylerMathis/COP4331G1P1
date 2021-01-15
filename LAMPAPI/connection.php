<?php
include_once 'Database.php';

// Create persistent instance of database
$db = new Database("TheBeast", "ProwlsTheServer", "127.0.0.1", "COP4331");
echo "I just got run!";