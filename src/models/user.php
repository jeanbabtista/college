<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/errorObject.php';

class User {
    /**
     * @throws Exception
     */
    static function exists(string $username, Database $db): bool {
        $conn = $db->getConnection();
        if (!$conn)
            throw new Exception('Error: database is not connected');

        list('error' => $error, 'message' => $message, 'data' => $data) = $db->query(
            "SELECT * FROM user WHERE username='" . $conn->real_escape_string($username) . "'"
        );

       if ($data->num_rows)
           return true;
       return false;
    }

    /**
     * @throws Exception
     */
    static function register(string $username, string $password, Database $db)
    {
        $conn = $db->getConnection();
        if (!$conn)
            throw new Exception('Error: database is not connected');

        $username = $conn->real_escape_string($username);
        $password = sha1($password);

        list('error' => $error, 'message' => $message, 'data' => $data) = $db->query(
            "INSERT INTO user (username, password) VALUES ('$username', '$password')"
        );

        if ($error)
            throw new Exception($message);
    }

    /**
     * @throws Exception
     */
    static function login(string $username, string $password, Database $db): ?mysqli_result {
        $conn = $db->getConnection();
        if (!$conn)
            throw new Exception('Error: database is not connected');

        $username = $conn->real_escape_string($username);
        $password = sha1($password);

        list('error' => $error, 'message' => $message, 'data' => $data) = $db->query(
            "SELECT * FROM user WHERE username='$username' AND password='$password'"
        );

        if ($error || !$data)
            throw new Exception($message);

        $user = $data->fetch_object();
        if ($user)
            return $user;
        return null;
    }
}