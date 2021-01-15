<?php

include_once 'model/User.php';

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
        $new_uname = $this->db->getConnection()->real_escape_string($username);
        $result = $this->db->query("SELECT * FROM Users WHERE USERNAME = $new_uname");

        if (empty($result) || $result->num_rows < 1) {
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
        // Sanitize both parameters
        $new_uname = $this->db->getConnection()->real_escape_string($login);
        $new_passwd = $this->db->getConnection()->real_escape_string($password);

        // Run SQL query.
        $sql = $this->db->getConnection()->prepare("SELECT * FROM Users WHERE Login=? AND Password=?");
        $sql->bind_param("ss",$new_uname, $new_passwd);
        $sql->execute();

        $result = $sql->get_result();

        // Make sure we got a result, if not the login is not valid.
        if (!$sql || $result->num_rows < 1) {
            echo mysqli_error($this->db->getConnection());
            return array("user" => null, "message" => "Invalid Username/Password");
        }

        // Get the user data
        $user = User::fromRow($result->fetch_assoc());

        return array("user" => $user, "message" => "Successful");
    }
}