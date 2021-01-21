<?php

include_once "Database.php";
include_once "model/Contact.php";

use Contactical\ErrorHandler;
use Contactical\Error;

class ContactStore
{
    /**
     * @var Database $db;
     */
    private $db;
    const TABLE_NAME = "Contacts";

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Creates a new contact and adds it to the database.
     *
     * @param Contact $contact
     * @return false|mysqli_result
     */
    function createContact($contact) {
        $sql = $this->db->getConnection()->prepare("INSERT INTO (UserID, FirstName, LastName, PhoneNumber, Address,ID) values (?, ?, ?, ?, ?)");
        $sql->bind_param("issssi",
            $contact->userID,
            $contact->firstName,
            $contact->lastName,
            $contact->phoneNumber,
            $contact->address,
            $contact->id
        );
        $sql->execute();

        return $sql->get_result();
    }


}