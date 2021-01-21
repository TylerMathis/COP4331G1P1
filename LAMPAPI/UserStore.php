<?php

include_once 'model/User.php';

use Contactical\Error;

/**
 * Class UserStore
 */
class UserStore
{
    /**
     * @var Database $db
     */
    private $db;

    /**
     * UserStore constructor.
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
    public function getUserByLogin($username)
    {
        // Sanitize and prepare SQL
        $sql = $this->db->prepare("SELECT * FROM Users WHERE Login=?");
        $sql->bind_param("s", $username);
        $sql->execute();
        $result = $sql->get_result();

        if (!$result || $result->num_rows < 1) {
            return null;
        }

        return User::fromArray($result->fetch_assoc());
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
     * @return bool Whether the login succeeded or not.
     */
    public function verifyLogin($login, $password)
    {
        // Prepare and run SQL query.
        $sql = $this->db->prepare("SELECT Password FROM Users WHERE Login=?");
        $sql->bind_param("s",$login);
        $sql->execute();

        // Receive and interpret the result.
        $result = $sql->get_result();
        if (!$result || $result->num_rows == 0)
            return false;
        $hashedPass = $result->fetch_array()["Password"];

        return password_verify($password, $hashedPass);
    }

    /**
     * @param array $arr The dictionary of user data.
     * @return array Indicating success.
     */
    public function createUser($arr)
    {
        // First check if user already exists.
        if ($this->getUserByLogin($arr["Login"]) != null) {
            return array("isDupe" => true, "result" => null);
        }
        
        // Prepare hashed password for insertion.
        $hashedPass = password_hash($arr["Password"], PASSWORD_DEFAULT);

        // Prepare and run SQL insertion.
        $sql = $this->db->prepare("INSERT INTO Users (Firstname, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $sql->bind_param("ssss", $arr["FirstName"], $arr["LastName"], $arr["Login"], $hashedPass);
        $result = $sql->execute();

        return array("isDupe" => false, "result" => $result);
    }
}