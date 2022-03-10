<?php

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/errorObject.php';

class Ad {
    /**
     * @throws Exception
     */
    static function getAll(Database $db): array {
        $data = $db->query("SELECT * from ad");

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }

    /**
     * @throws Exception
     */
    static function find(string $id, Database $db): ?mysqli_result {
        $conn = $db->getConnection();

        return $db->query(
            "SELECT ad.*, user.username FROM ad LEFT JOIN user ON user.id = ad.user_id WHERE ad.id = " .
            $conn->real_escape_string($id)
        );
    }

    /**
     * @throws Exception
     */
    static function create(string $title, string $desc, string $image_url, string $user_id, Database $db): bool {
        $conn = $db->getConnection();

        $db->query(
            "INSERT INTO ad (title, description, image, user_id) VALUES('" .
                        $conn->real_escape_string($title) . "', '" .
                        $conn->real_escape_string($desc) . "', '" .
                        $conn->real_escape_string($image_url) . "', '" .
                        $conn->real_escape_string($user_id) . "')"
        );

        return !$conn->errno;
    }

    /**
     * @throws Exception
     */
    static function updateImage(string $id, string $image_url, Database $db): bool {
        $conn = $db->getConnection();

        $db->query(
            "UPDATE ad SET image = '" . $conn->real_escape_string($image_url) . "' WHERE ad.id = $id"
        );

        return !$conn->errno;
    }
}