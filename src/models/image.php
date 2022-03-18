<?php

/** @noinspection PhpIllegalPsrClassPathInspection */

require_once __DIR__ . '/../utils/responseObject.php';

class Image {
    /**
     * @throws Exception
     */
    public static function save(string $path, Database $db) {
        $db->query("INSERT INTO image (path) VALUES ('$path')");
    }

    /**
     * @throws Exception
     */
    public static function findById(string $path, Database $db) {
        $db->query("INSERT INTO image (path) VALUES ('$path')");
    }
}