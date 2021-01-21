<?php

include_once "Database.php";
include_once "model/Contact.php";

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
    public function createContact($contact) {
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

    /**
     * Updates a contact
     *
     * @param Contact $contact
     * @return bool
     */
    public function updateContact($contact) {
        $sql = $this->db->getConnection()->prepare("UPDATE ".ContactStore::TABLE_NAME." SET FirstName=?, LastName=?, PhoneNumber=?, Address=? WHERE ID=?");
        $sql->bind_param("ssssi", $contact->firstName, $contact->lastName, $contact->phoneNumber, $contact->address, $contact->id);
        $sql->execute();

        return $sql->get_result() == false ? false : true;
    }

    /**
     * Deletes a given contact
     *
     * @param int $id The contact ID to delete
     * @return bool
     */
    public function deleteContact($id) {
        $sql = $this->db->getConnection()->prepare("DELETE FROM ".ContactStore::TABLE_NAME." WHERE ID=?");
        $sql->bind_param("i", $id);
        $sql->execute();

        return $sql->get_result() == false ? false : true;
    }


}