<?php

include_once 'model/User.php';

use Contactical\Error;

/**
 * Class ContactStore
 */
class ContactStore
{
    /**
     * @var Database $db
     */
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
     * Gets a username from the DB given the username.
     *
     * @param string $username The username to look up.
     * @return User|null
     */
    public function get_user_by_username($username)
    {
        // Sanitize and prepare SQL
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
     * Verifies the login given the parameters. Returns an associative
     * array with two elements:
     * - The User object, keyed by "user"
     * - The Error object, keyed by "error"
     *
     * On a successful transaction the @link Error object will be null, and
     * the @link User object will be non-null, vice versa if the transaction fails.
     *
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