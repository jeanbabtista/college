<?php

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/errorObject.php';
require_once __DIR__ . '/../utils/files.php';

class User {
    /**
     * @throws Exception
     */
    public static function exists(string $username, Database $db): bool {
        $conn = $db->getConnection();

        $data = $db->query(
            "SELECT * FROM user WHERE username='" . $conn->real_escape_string($username) . "'"
        );

       if ($data->num_rows)
           return true;
       return false;
    }

    /**
     * @throws Exception
     */
    public static function register(string $username, string $password, Database $db): bool|mysqli_result
    {
        $conn = $db->getConnection();
        $username = $conn->real_escape_string($username);
        $password = sha1($password);

        return $db->query(
            "INSERT INTO user (username, password) VALUES ('$username', '$password')"
        );
    }

    /**
     * @throws Exception
     */
    public static function login(string $username, string $password, Database $db): ?stdClass {
        $conn = $db->getConnection();
        $username = $conn->real_escape_string($username);
        $password = sha1($password);

        $data = $db->query(
            "SELECT * FROM user WHERE username='$username' AND password='$password'"
        );

        $user = $data->fetch_object();

        if ($user)
            return $user;
        return null;
    }
}