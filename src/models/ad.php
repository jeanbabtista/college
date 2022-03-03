<?php

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/errorObject.php';

class Ad {
    /**
     * @throws Exception
     */
    static function find(string $id, Database $db): mysqli_result {
        $conn = $db->getConnection();
        if (!$conn)
            throw new Exception('Error: database is not connected');

        list('error' => $error, 'message' => $message, 'data' => $data) = $db->query(
            "SELECT ad.*, user.username FROM ad LEFT JOIN user ON user.id = ad.user_id WHERE ad.id = " .
            $conn->real_escape_string($id)
        );

        if ($error)
            throw new Exception($message);

        return $data;
    }
}