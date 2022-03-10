<?php

require_once __DIR__ . '/../public/partials/header.php';
require_once __DIR__ . '/../utils/errorObject.php';

class Ad {
    /**
     * @throws Exception
     */
    public static function getAll(Database $db): array {
        $data = $db->query("SELECT ad.*, user.username FROM ad JOIN user ON user.id = ad.user_id");

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }

    /**
     * @throws Exception
     */
    public static function getOneById(string $id, Database $db): ?stdClass
    {
        $conn = $db->getConnection();
        $id = $conn->real_escape_string($id);

        $data = $db->query(
            "SELECT ad.*, user.username FROM ad LEFT JOIN user ON user.id = ad.user_id WHERE ad.id = $id"
        );

        if (!$data)
            return null;
        return $data->fetch_object();
    }

    /**
     * @throws Exception
     */
    public static function create(string $title, string $desc, string $imagePath, string $user_id, Database $db): bool {
        $conn = $db->getConnection();

        $title = $conn->real_escape_string($title);
        $desc = $conn->real_escape_string($desc);
        $image = $conn->real_escape_string($imagePath);
        $user_id = $conn->real_escape_string($user_id);

        $db->query("INSERT INTO ad (title, description, image, user_id) VALUES('$title', '$desc', '$image', '$user_id')");

        return !$conn->errno;
    }
}