<?php

/**
 * Class User
 */
class User
{

    /** @var string $firstName */
    public $firstName;

    /** @var string $lastName */
    public $lastName;

    /** @var int $ID */
    public $ID;

    /** @var string $login */
    public $login;

    /**
     * User constructor.
     *
     * @param string $first_name
     * @param string $last_name
     * @param int $ID
     */
    public function __construct($first_name, $last_name, $ID, $login)
    {
        $this->firstName = $first_name;
        $this->lastName = $last_name;
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
        return array("FirstName" => $this->firstName, "LastName" => $this->lastName,
            "ID" => $this->ID, "Login" => $this->login);
    }
}