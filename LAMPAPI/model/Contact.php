<?php


class Contact
{
    /** @var int $userID */
    private $userID;

    /** @var string $firstName */
    private $firstName;

    /** @var string $lastName */
    private $lastName;

    /** @var string $phoneNumber */
    private $phoneNumber;

    /** @var string $address */
    private $address;

    /** @var int $id */
    private $id;

    /**
     * Contact constructor.
     *
     * @param $userID
     * @param $firstName
     * @param $lastName
     * @param $phoneNumber
     * @param $address
     */
    function __construct($userID, $firstName, $lastName, $phoneNumber, $address, $id) {
        $this->userID = $userID;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->phoneNumber = $phoneNumber;
        $this->address = $address;
        $this->id = $id;
    }

    public static function fromArray($arr) {
        return new self($arr["UserID"], $arr["FirstName"],
            $arr["LastName"], $arr["PhoneNumber"], $arr["Address"], $arr["ID"]);
    }

    /**
     * @return int
     */
    public function getUserID()
    {
        return $this->userID;
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * @return string
     */
    public function getPhoneNumber()
    {
        return $this->phoneNumber;
    }

    /**
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

}