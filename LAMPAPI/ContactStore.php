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

    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * Fetches the contacts associated with the given user ID.
     *
     * @param int $userID
     * @return false|array
     */
    public function getContactsForUser($userID)
    {
        $sql = $this->db->prepare("SELECT * FROM ".ContactStore::TABLE_NAME." WHERE USERID = ?");
        $sql->bind_param("i", $userID);
        $sql->execute();

        $result = $sql->get_result();
        if (!$result) {
            return false;
        }

       return $this->serializeContacts($result);
    }

    /**
     * @param mysqli_result $result
     * @return array
     */
    private function serializeContacts($result) {
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
     * @return bool
     */
    public function createContact($contact)
    {
        $sql = $this->db->prepare("INSERT INTO ".ContactStore::TABLE_NAME." (UserID, FirstName, LastName, PhoneNumber, Address, City, State, ZIP, ID) values (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        echo $this->db->getError();
        $sql->bind_param("isssssssi",
            $contact->userID,
            $contact->firstName,
            $contact->lastName,
            $contact->phoneNumber,
            $contact->address,
            $contact->city,
            $contact->state,
            $contact->zip,
            $contact->id
        );
        $sql->execute();

        if ($sql->affected_rows < 1) {
            return false;
        }

        return true;
    }

    /**
     * Updates a contact
     *
     * @param Contact $contact
     * @return bool
     */
    public function updateContact($contact)
    {
        $sql = $this->db->prepare("UPDATE ".ContactStore::TABLE_NAME." SET FirstName=?, LastName=?, PhoneNumber=?, Address=? WHERE ID=?");
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
    public function deleteContact($id)
    {
        $sql = $this->db->prepare("DELETE FROM ".ContactStore::TABLE_NAME." WHERE ID=?");
        $sql->bind_param("i", $id);
        $sql->execute();

        return $sql->get_result() == false ? false : true;
    }

    /**
     * Does a contact query from the given keywords.
     *
     * @param int $userID
     * @param string $keyword
     * @return array|false
     */
    public function searchContact($userID, $keyword) {
        $keyword = $keyword."%";
        $userID = intval($userID);
        $sql = $this->db->prepare("SELECT * FROM ".ContactStore::TABLE_NAME." WHERE (UserID=? AND (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ?))");
        $sql->bind_param("isss", $userID, $keyword, $keyword, $keyword);
        $sql->execute();


        $result = $sql->get_result();
        if (!$result) {
            return false;
        }

        return $this->serializeContacts($result);
    }


}