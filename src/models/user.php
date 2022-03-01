<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/errorObject.php';

class User {
    #[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "bool|mysqli_result"])]
    static function exists(string $username, Database $db): array {
        $conn = $db->getConnection();
        if (!$conn)
            return getErrorObject(true, 'Error: database is not connected');

        list('error' => $error, 'message' => $message, 'data' => $data) = $db->query(
            "SELECT * FROM user WHERE username='" . $conn->real_escape_string($username) . "'"
        );

        return getErrorObject($error, $error ? 'Data from query is null' : 'Successfully fetched data', $data);
    }

    #[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
    static function register(string $username, string $password, Database $db): array
    {
        $conn = $db->getConnection();
        if (!$conn)
            return getErrorObject(true, 'Error: database is not connected');

        $username = $conn->real_escape_string($username);
        $password = sha1($password);
        list('error' => $error, 'message' => $message, 'data' => $data) = $db->query(
            "INSERT INTO user (username, password) VALUES ('$username', '$password')"
        );

        return getErrorObject($error, $error ? 'Data from query is null' : 'Successfully fetched data', $data);
    }
}