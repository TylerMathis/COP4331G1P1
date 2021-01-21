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
     * Fetches the contacts associated with the given user ID.
     *
     * @param int $userID
     * @return false|array
     */
    public function getContactsForUser($userID) {
        $sql = $this->db->getConnection()->prepare("SELECT * FROM ".ContactStore::TABLE_NAME." WHERE USERID = ?");
        $sql->bind_param("i", $userID);
        $sql->execute();

        $result = $sql->get_result();
        if (!$result) {
            return false;
        }

        $contacts = array();

        while ($row = $result->fetch_assoc()) {
            $contact = Contact::fromArray($row);
            array_push($contacts, $contact);
        }

        return $contacts;
    }

    /**
     * Creates a new contact and adds it to the database.
     *
     * @param Contact $contact
     * @return false|mysqli_result
     */
    function createContact($contact) {
        $sql = $this->db->getConnection()->prepare("INSERT INTO ".ContactStore::TABLE_NAME." (UserID, FirstName, LastName, PhoneNumber, Address,ID) values (?, ?, ?, ?, ?)");
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

    function updateContact($id, $fields) {

    }


}