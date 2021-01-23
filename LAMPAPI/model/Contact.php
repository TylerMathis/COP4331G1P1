<?php

/**
 * Class Contact
 */
class Contact
{
    /** @var int $userID */
    public $userID;

    /** @var string $firstName */
    public $firstName;

    /** @var string $lastName */
    public $lastName;

    /** @var string $phoneNumber */
    public $phoneNumber;

    /** @var string $address */
    public $address;

    /** @var int $id */
    public $id;

    /**
     * Contact constructor.
     *
     * @param $userID
     * @param $firstName
     * @param $lastName
     * @param $phoneNumber
     * @param $address
     * @param $id
     */
    function __construct($userID, $firstName, $lastName, $phoneNumber, $address, $id)
    {
        $this->userID = $userID;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->phoneNumber = $phoneNumber;
        $this->address = $address;
        $this->id = $id;
    }

    /**
     * @param array $arr array to serialize from.
     * @return Contact The newly created Contact
     */
    public static function fromArray($arr)
    {
        return new self($arr["UserID"], $arr["FirstName"],
            $arr["LastName"], $arr["PhoneNumber"], $arr["Address"], array_key_exists("ID", $arr) ? $arr["ID"] : null);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array("UserID" => $this->userID, "FirstName" => $this->firstName, "LastName" => $this->lastName,
            "PhoneNumber" => $this->phoneNumber, "Address" => $this->address, "ID" => $this->id);
    }
}
