<?php

/**
 * Class User
 */
class User
{
    private $first_name;
    private $last_name;
    private $ID;
    private $login;

    /**
     * User constructor.
     *
     * @param string $first_name
     * @param string $last_name
     * @param int $ID
     */
    public function __construct($first_name, $last_name, $ID, $login)
    {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->ID = $ID;
        $this->login = $login;
    }

    /**
     * Gives a new User object from the given array.
     *
     * @param array $arr The array to serialize
     * @return User The user object created from the row.
     */
    public static function fromArray(array $arr)
    {
        return new self($arr["FirstName"], $arr["LastName"], $arr["ID"], $arr["Login"]);
    }

    /**
     * Converts object into associative array.
     *
     * @return array
     */
    public function toArray()
    {
        return array("FirstName" => $this->first_name, "LastName" => $this->last_name,
            "ID" => $this->ID, "Login" => $this->login);
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

    /**
     * @return mixed
     */
    public function getLogin()
    {
        return $this->login;
    }
}