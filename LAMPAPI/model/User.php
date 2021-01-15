<?php


class User
{
    /** @var string $first_name */
    private $first_name;

    /** @var string $last_name */
    private $last_name;

    /** @var int $ID */
    private $ID;

    /**
     * User constructor.
     *
     * @param string $first_name
     * @param string $last_name
     * @param int $ID
     */
    public function __construct($first_name, $last_name, $ID) {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->ID = $ID;
    }

    /**
     * Gives a new User object from the given SQL row.
     *
     * @param array $row
     * @return User
     */
    public static function fromRow($row) {
        return new self($row["FirstName"], $row["LastName"], $row["ID"]);
    }

    /**
     * Converts object into associative array.
     *
     * @return array
     */
    public function toArray() {
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