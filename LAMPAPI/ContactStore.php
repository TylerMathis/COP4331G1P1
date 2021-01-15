<?php

include_once 'model/User.php';

use Contactical\Error;

class ContactStore
{
    /** @var Database $db */
    private $db;

    /**
     * ContactStore constructor.
     *
     * @param Database $db
     */
    public function __construct($db)
    {
        $this->db = $db;
    }

    /**
     * @param string $username The username to look up.
     * @return User|null
     */
    public function get_user_by_username($username)
    {
        // Sanitize username
        $sql = $this->db->getConnection()->prepare("SELECT * FROM Users WHERE USERNAME=?");
        $sql->bind_param("s", $username);
        $sql->execute();
        $result = $sql->get_result();

        if (!$result || $result->num_rows < 1) {
            return null;
        }

        return User::fromRow($result->fetch_assoc());
    }

    /**
     * @param string $login The username of the user.
     * @param string $password The password of the user.
     * @return array Whether the login succeeded or not.
     */
    public function verify_login($login, $password)
    {
        // Prepare and run SQL query.
        $sql = $this->db->getConnection()->prepare("SELECT * FROM Users WHERE Login=? AND Password=?");
        $sql->bind_param("ss",$login, $password);
        $sql->execute();

        $result = $sql->get_result();

        // Make sure we got a result, if not the login is not valid.
        if (!$result || $result->num_rows < 1) {
            echo mysqli_error($this->db->getConnection());
            $error = new Error("Invalid Login or Password.",
                "Credentials could not be found in database.");
            return array("user" => null, "error" => $error);
        }

        // Get the user data
        $user = User::fromRow($result->fetch_assoc());

        return array("user" => $user, "error" => null);
    }
}