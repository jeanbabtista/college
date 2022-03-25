<?php

namespace App\models;

use Database;
use stdClass;

class CategoryModel
{
    public string $id, $title;

    /**
     * @param string $id
     * @param string $title
     */
    public function __construct(string $id, string $title)
    {
        $this->id = $id;
        $this->title = $title;
    }

    /**
     * @return array
     */
    public static function findAll(): array
    {
        $db = (new Database)->getInstance();
        $data = $db->query("SELECT * FROM category");

        $categories = [];
        while ($category = $data->fetch_object())
            $categories[] = $category;

        return $categories;
    }

    /**
     * @param string $id
     * @return stdClass|null
     */
    public static function findOneById(string $id): ?stdClass
    {
        $db = (new Database)->getInstance();
        $data = $db->query("SELECT * FROM category WHERE id = $id");

        $category = $data->fetch_object();

        return $category ?: null;
    }
}