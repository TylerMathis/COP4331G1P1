<?php

include_once 'Error/ErrorHandler.php';

use Contactical\ErrorHandler;
use Contactical\Error;

class Database
{
    private $username;
    private $password;
    private $host;
    private $connection;
    private $database;

    /**
     * Database constructor.
     *
     * @param $username String username.
     * @param $password String password.
     * @param $host String hostname of the database/
     * @param $database String name of the selected database.
     */
    function __construct($username, $password, $host, $database)
    {
        // Set instance variables
        $this->username = $username;
        $this->password = $password;
        $this->host = $host;
        $this->database = $database;

        // Open database connection
        $this->connection = new mysqli($host, $username, $password, $database);

        if (!$this->connection) {
            $error = mysqli_error($this->connection);
            ErrorHandler::generic_error(new Error("Coult not connect to database.", $error));
        }
    }

    /**
     * Gets the persistent database connection.
     *
     * @return mysqli
     */
    public function getConnection()
    {
        return $this->connection;
    }

    /**
     * @param $sql string The sql to execute
     * @return bool|mysqli_result
     */
    public function query($sql) {
        return $this->connection->query($sql);
    }
}
