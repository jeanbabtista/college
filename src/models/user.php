<?php

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/responseObject.php';
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
    public static function register(
        string $username,
        string $email,
        string $fname,
        string $lname,
        string $password,
        string $address,
        string $phone,
        string $post,
        string $sex,
        int $age,
        Database $db
    ): bool|mysqli_result
    {
        $conn = $db->getConnection();
        $username = $conn->real_escape_string($username);
        $email = $conn->real_escape_string($email);
        $fname = $conn->real_escape_string($fname);
        $lname = $conn->real_escape_string($lname);
        $password = sha1($password);
        $address = $conn->real_escape_string($address);
        $phone = $conn->real_escape_string($phone);
        $post = $conn->real_escape_string($post);
        $sex = $conn->real_escape_string($sex);

        return $db->query(
            "INSERT INTO user (username, email, fname, lname, password, address, phone, post, sex, age) VALUES
                ('$username', '$email', '$fname', '$lname', '$password', '$address', '$phone', '$post', '$sex', '$age')"
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