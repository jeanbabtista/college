<?php

/** @noinspection PhpIllegalPsrClassPathInspection */

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../utils/responseObject.php';
require_once __DIR__ . '/../models/image.php';
require_once __DIR__ .'/../utils/toast.php';

class Ad {
    /**
     * @throws Exception
     */
    public static function findAll(bool $isOutOfDate, Database $db): array
    {
        $query = $isOutOfDate ?
            "SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad a
            JOIN image i ON a.front_image_id = i.id
            JOIN user u ON a.user_id = u.id
            ORDER BY a.date_end DESC"
            :
            "SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad a
            JOIN image i ON a.front_image_id = i.id
            JOIN user u ON a.user_id = u.id AND a.date_end >= CURDATE()
            ORDER BY a.date_end DESC";

        $data = $db->query($query);

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }

    /**
     * @throws Exception
     */
    public static function findAllByCategoryId(string $id, bool $isOutOfDate, Database $db): array {
        $id = $db->getConnection()->real_escape_string($id);

        $query = $isOutOfDate ?
            "SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE ac.category_id = $id
            ORDER BY a.date_end DESC"
            :
            "SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE ac.category_id = $id AND a.date_end >= CURDATE()
            ORDER BY a.date_end DESC";

        $data = $db->query($query);

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }

    /**
        * @throws Exception
    */
    #[ArrayShape(['ad' => "array", 'categories' => "array", 'images' => "array"])]
    public static function findOneById(string $id, Database $db): array
    {
        $conn = $db->getConnection();
        $id = $conn->real_escape_string($id);

        $adData = $db->query(
            "SELECT a.id, a.title, a.description, a.date_start, a.date_end, a.views, u.id as userId, u.username, u.email
            FROM ad_images ai
            JOIN ad a ON ai.ad_id = a.id            
            JOIN user u ON a.user_id = u.id
            WHERE a.id = $id
            GROUP BY a.id"
        );

        $categoriesData = $db->query(
            "SELECT c.title AS categories
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN category c ON ac.category_id = c.id
            WHERE a.id = $id"
        );

        $imagesData = $db->query(
            "SELECT i.path
            FROM ad_images ai 
            JOIN ad a ON ai.ad_id = a.id
            JOIN image i on ai.image_id = i.id
            WHERE a.id = $id"
        );

        $ad = $adData->fetch_object();
        if (!$ad)
            $ad = null;

        $categories = [];
        while ($category = $categoriesData->fetch_object())
            $categories[] = $category->categories;

        $images = [];
        while ($image = $imagesData->fetch_object())
            $images[] = $image->path;

        return [
            'ad' => json_decode(json_encode($ad), true),
            'categories' => $categories,
            'images' => $images
        ];
    }

    /**
     * @throws Exception
     */
    public static function save(
        string $title,
        string $description,
        string $userId,
        array $imagesNames,
        array $categories,
        Database $db
    ): bool {
        $conn = $db->getConnection();

        // insert ad
        $today = strtotime(date("Y-m-d H:i:s"));
        $oneMonthFromNow = strtotime('+1 month', $today);
        $dateEnd = date("Y-m-d H:i:s", $oneMonthFromNow);

        $title = $conn->real_escape_string($title);
        $description = $conn->real_escape_string($description);
        $userId = $conn->real_escape_string($userId);

        $db->query("INSERT INTO ad (
                title,
                description,
                date_end,
                user_id
            ) VALUES (
                '$title',
                '$description',
                '$dateEnd',
                '$userId'
            )");

        $adId = $conn->insert_id;

        // update ad_categories table
        foreach($categories as $categoryId)
            $db->query("INSERT INTO ad_categories (ad_id, category_id) VALUES ('$adId', '$categoryId')");

        // update ad_images table
        $imagesIds = [];
        foreach($imagesNames as $imageName)
            if ($imageName) {
                Image::save($imageName, $db);
                $imagesIds[] = $conn->insert_id;
            }

        foreach($imagesIds as $imageId)
            $db->query("INSERT INTO ad_images (ad_id, image_id) VALUES ('$adId', '$imageId')");

        // update ad's front image
        $db->query("UPDATE ad SET front_image_id = ${imagesIds[0]} WHERE id = $adId");

        return !$conn->errno;
    }

    /**
     * @throws Exception
     */
    public static function delete(string $id, Database $db) {
        $db->query("DELETE FROM ad WHERE id = $id");
    }

    /**
     * @throws Exception
     */
    public static function incrementViews(string $id, Database $db) {
        $db->query("UPDATE ad SET views = views + 1 WHERE id = $id");
    }

    /**
     * @throws Exception
     */
    public static function updateOneById(
        string $id,
        string $title,
        string $description,
        string $dateEnd,
        Database $db)
    {
        $conn = $db->getConnection();

        $id = $conn->real_escape_string($id);
        $title = $conn->real_escape_string($title);
        $description = $conn->real_escape_string($description);
        $dateEnd = date("Y-m-d H:i:s", strtotime($conn->real_escape_string($dateEnd)));

        // update ad
        $db->query(
            "UPDATE ad a
            SET a.title = '$title',
                a.description = '$description',
                a.date_end = '$dateEnd'
            WHERE id = $id"
        );
    }

    /**
     * @throws Exception
     */
    public static function findAllByCategoryIdAndSearch(
        string $id,
        string $search,
        bool $isOutOfDate,
        Database $db
    ): array {
        $id = $db->getConnection()->real_escape_string($id);
        $search = $db->getConnection()->real_escape_string($search);

        $query = $isOutOfDate ?
            "SELECT DISTINCT * FROM
            (SELECT DISTINCT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE ac.category_id = $id AND
                (a.title LIKE '%$search%' OR a.description LIKE '%$search%')
            ORDER BY a.date_end DESC) a"
            :
            "SELECT DISTINCT * FROM
            (SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE ac.category_id = $id AND
                  a.date_end >= CURDATE() AND
                  (a.title LIKE '%$search%' OR a.description LIKE '%$search%')
            ORDER BY a.date_end DESC) a";

        $data = $db->query($query);

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }

    /**
     * @throws Exception
     */
    public static function findAllBySearch(string $search, bool $isOutOfDate, Database $db): array {
        $search = $db->getConnection()->real_escape_string($search);

        $query = $isOutOfDate ?
            "SELECT DISTINCT * FROM
            (SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE a.title LIKE '%$search%' OR
                  a.description LIKE '%$search%'
            ORDER BY a.date_end DESC) a"
            :
            "SELECT DISTINCT * FROM 
                (SELECT a.id, a.title, a.description, a.views, u.username, i.path
                FROM ad_categories ac
                JOIN ad a ON ac.ad_id = a.id
                JOIN user u ON a.user_id = u.id
                JOIN image i ON a.front_image_id = i.id
                JOIN category c ON ac.category_id = c.id
                WHERE (a.title LIKE '%$search%' OR a.description LIKE '%$search%')
                    AND a.date_end >= CURDATE()
                ORDER BY a.date_end DESC) a";

        $data = $db->query($query);

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }
}