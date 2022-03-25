<?php

namespace App\models;

use Database;
use JetBrains\PhpStorm\ArrayShape;

class AdModel
{
    public string $id,
        $title,
        $description,
        $dateStart,
        $dateEnd,
        $userId,
        $frontImageId;
    public int $views;

    public function __construct(
        string $id,
        string $title,
        string $description,
        string $dateStart,
        string $dateEnd,
        int    $views,
        string $userId,
        string $frontImageId
    )
    {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
        $this->dateStart = $dateStart;
        $this->dateEnd = $dateEnd;
        $this->userId = $userId;
        $this->views = $views;
        $this->frontImageId = $frontImageId;
    }

    /**
     * @param bool $isOutOfDate -> returns sorted array by date if true
     * @return array
     */
    public static function findAll(bool $isOutOfDate): array
    {
        $db = (new Database)->getInstance();

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
     * @param string $id -> ad id
     * @return array
     */
    #[ArrayShape(['ad' => "stdClass|null", 'categories' => "array", 'images' => "array"])]
    public static function findOneById(string $id): array
    {
        $db = (new Database)->getInstance();

        $id = $db->real_escape_string($id);

        $adData = $db->query(
            "SELECT a.id, a.title, a.description, a.date_start, a.date_end, a.views, u.id as userId, u.username,
                u.email
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
     * @param string $title
     * @param string $description
     * @param string $userId
     * @param array $imagesNames
     * @param array $categories
     */
    public static function create(
        string $title,
        string $description,
        string $userId,
        array  $imagesNames,
        array  $categories
    )
    {
        $db = (new Database)->getInstance();

        // insert ad
        $today = strtotime(date("Y-m-d H:i:s"));
        $oneMonthFromNow = strtotime('+1 month', $today);
        $dateEnd = date("Y-m-d H:i:s", $oneMonthFromNow);

        $title = $db->real_escape_string($title);
        $description = $db->real_escape_string($description);
        $userId = $db->real_escape_string($userId);

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

        $adId = $db->insert_id;

        // update ad_categories table
        foreach ($categories as $categoryId)
            $db->query("INSERT INTO ad_categories (ad_id, category_id) VALUES ('$adId', '$categoryId')");

        // update ad_images table
        $imagesIds = [];
        foreach ($imagesNames as $imageName)
            if ($imageName) {
                ImageModel::save($imageName);
                $imagesIds[] = $db->insert_id;
            }

        foreach ($imagesIds as $imageId)
            $db->query("INSERT INTO ad_images (ad_id, image_id) VALUES ('$adId', '$imageId')");

        // update ad's front image
        $db->query("UPDATE ad SET front_image_id = ${imagesIds[0]} WHERE id = $adId");
    }

    /**
     * @param string $id
     * @param bool $isOutOfDate
     * @return array
     */
    public static function findAllByCategoryId(string $id, bool $isOutOfDate = false): array
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);

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
     * @param string $id
     * @return void
     */
    public static function incrementViews(string $id)
    {
        $db = (new Database)->getInstance();
        $db->query("UPDATE ad SET views = views + 1 WHERE id = $id");
    }

    public static function updateOneById(
        string $id,
        string $title,
        string $description,
        string $dateEnd
    )
    {
        $db = (new Database)->getInstance();

        $id = $db->real_escape_string($id);
        $title = $db->real_escape_string($title);
        $description = $db->real_escape_string($description);
        $dateEnd = date("Y-m-d H:i:s", strtotime($db->real_escape_string($dateEnd)));

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
     * @param string $adId
     * @return bool
     */
    public static function deleteOneById(string $adId): bool
    {
        $db = (new Database)->getInstance();

        // check if ad exists
        $ad = $db->query("SELECT id FROM ad WHERE id = $adId");
        if (!$ad->fetch_object())
            return false;

        $user = $db->query("SELECT u.username FROM ad a JOIN user u ON a.user_id = u.id LIMIT 1")->fetch_object();

        // get images for ad
        $data = $db->query("SELECT ai.image_id as id, i.path
            FROM ad_images ai
            JOIN image i ON ai.image_id = i.id
            WHERE ai.ad_id = $adId"
        );

        $imagesIds = [];
        $imagesPaths = [];
        while ($image = $data->fetch_object()) {
            $imagesIds[] = $image->id;
            $imagesPaths[] = $image->path;
        }

        // delete images from `image` table
        foreach ($imagesIds as $imageId)
            $db->query("DELETE FROM image WHERE id = $imageId");

        // delete images from server directories
        foreach ($imagesPaths as $imagePath)
            deleteImage("{$_SERVER['DOCUMENT_ROOT']}/images/$user->username/$imagePath");

        // delete comments
        $comments = CommentModel::findAllByAdId($adId);
        foreach ($comments as $comment)
            CommentModel::deleteOneById($comment->id);

        // delete ad
        $db->query("DELETE FROM ad WHERE id = $adId");

        return true;
    }

    /**
     * @param string $id
     * @param string $search
     * @param bool $isOutOfDate
     * @return array
     */
    public static function findAllByCategoryIdAndSearch(string $id, string $search, bool $isOutOfDate): array
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);
        $search = $db->real_escape_string($search);

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

    public static function findAllBySearch(string $search, bool $isOutOfDate): array
    {
        $db = (new Database)->getInstance();
        $search = $db->real_escape_string($search);

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