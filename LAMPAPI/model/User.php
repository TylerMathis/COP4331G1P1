<?php

/**
 * Class User
 */
class User
{
    private $first_name;
    private $last_name;
    private $ID;

    /**
     * User constructor.
     *
     * @param string $first_name
     * @param string $last_name
     * @param int $ID
     */
    public function __construct($first_name, $last_name, $ID)
    {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->ID = $ID;
    }

    /**
     * Gives a new User object from the given SQL row.
     *
     * @param array $row The SQL row to serialize
     * @return User The user object created from the row.
     */
    public static function fromRow($row)
    {
        return new self($row["FirstName"], $row["LastName"], $row["ID"]);
    }

    /**
     * Converts object into associative array.
     *
     * @return array
     */
    public function toArray()
    {
        return array("FirstName" => $this->first_name, "LastName" => $this->last_name, "ID" => $this->ID);
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return $this->first_name;
    }

    /**
     * @return int
     */
    public function getID()
    {
        return $this->ID;
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return $this->last_name;
    }
}