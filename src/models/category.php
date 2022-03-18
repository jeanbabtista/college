<?php

/** @noinspection PhpIllegalPsrClassPathInspection */

require_once __DIR__ . '/../utils/responseObject.php';

class Category {
    /**
     * @throws Exception
     */
    public static function findAll(Database $db): array {
        $data = $db->query("SELECT * FROM category");

        $categories = [];
        while ($category = $data->fetch_object())
            $categories[] = $category;

        return $categories;
    }

    /**
     * @throws Exception
     */
    public static function findOneById(string $id, Database $db): ?stdClass {
        $data = $db->query("SELECT * FROM category WHERE id = $id");

        if (!$data)
            return null;
        return $data->fetch_object();
    }

//    /**
//     * @throws Exception
//     */
//    public static function findRecursive(string $id, Database $db): ?stdClass {
//        $data = $db->query(
//            "WITH RECURSIVE cte (id, title, parent_id) AS (
//                      SELECT id, title, parent_id
//                      FROM category
//                      WHERE parent_id = 19
//                      UNION ALL
//                      SELECT p.id, p.name, p.parent_id
//                      FROM category c
//                      INNER JOIN cte ON p.parent_id = cte.id
//                    )
//                    SELECT * FROM cte"
//        );
//
//        if (!$data)
//            return null;
//        return $data->fetch_object();
//    }
}