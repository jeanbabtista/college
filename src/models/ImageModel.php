<?php

namespace App\models;

use Database;

class ImageModel
{
    /**
     * @param string $path
     * @return void
     */
    public static function save(string $path)
    {
        $db = (new Database)->getInstance();
        $db->query("INSERT INTO image (path) VALUES ('$path')");
    }

    /**
     * @param string $path
     * @return void
     */
    public static function findById(string $path)
    {
        $db = (new Database)->getInstance();
        $db->query("INSERT INTO image (path) VALUES ('$path')");
    }
}