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

    /** @var string $city */
    public $city;

    /** @var string $state */
    public $state;

    /** @var string zip */
    public $zip;

    /** @var int $id */
    public $id;

    private static $fieldNames = array("UserID", "FirstName", "LastName", "PhoneNumber", "Address", "City", "State", "ZIP", "ID");

    /**
     * Contact constructor.
     *
     * @param $userID
     * @param $firstName
     * @param $lastName
     * @param $phoneNumber
     * @param $address
     * @param $city
     * @param $state
     * @param $zip
     * @param $id
     */
    function __construct($userID, $firstName, $lastName, $phoneNumber, $address, $city, $state, $zip, $id)
    {
        $this->userID = $userID;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->phoneNumber = $phoneNumber;
        $this->address = $address;
        $this->zip = $zip;
        $this->state = $state;
        $this->city = $city;
        $this->id = $id;
    }

    /**
     * @param array $arr array to serialize from.
     * @return Contact The newly created Contact
     */
    public static function fromArray($arr)
    {
        // Fill in any gaps in data.
        foreach (Contact::$fieldNames as $fieldName) {
            if (!array_key_exists($fieldName, $arr)) {
                $arr[$fieldName] = null;
            }
        }
        
        return new self($arr["UserID"], $arr["FirstName"],
            $arr["LastName"], $arr["PhoneNumber"], $arr["Address"],
            $arr["City"], $arr["State"], $arr["ZIP"], $arr["ID"]);
    }

    /**
     * @return array
     */
    public function toArray()
    {
        return array("UserID" => $this->userID, "FirstName" => $this->firstName, "LastName" => $this->lastName,
            "PhoneNumber" => $this->phoneNumber, "Address" => $this->address, "City" => $this->city,
            "State" => $this->state, "ZIP" => $this->zip, "ID" => $this->id);
    }
}
