<?php /** @noinspection PhpIllegalPsrClassPathInspection */

require_once __DIR__ . '/../utils/responseObject.php';
require_once __DIR__ . '/../utils/files.php';

class User {
    /**
     * @throws Exception
     */
    public static function findOneById(string $id, Database $db): ?stdClass {
        $data = $db->query("SELECT * FROM user WHERE id = '" . $db->getConnection()->real_escape_string($id) . "'");
        $user = $data->fetch_object();

        if (!$user)
            return null;
        return $user;
    }

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

    /**
     * @throws Exception
     */
    public static function findAllAds(string $id, bool $isOutOfDate, Database $db): array {
        $id = $db->getConnection()->real_escape_string($id);

        $query = $isOutOfDate ?
            "SELECT a.id, a.title, a.description, a.views, i.path
            FROM ad a
            JOIN image i on a.front_image_id = i.id
            WHERE user_id = $id
            ORDER BY a.date_end DESC"
            :
            "SELECT a.id, a.title, a.description, a.views, i.path
            FROM ad a
            JOIN image i on a.front_image_id = i.id
            WHERE user_id = $id AND a.date_end >= CURDATE()
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
    public static function findAllAdsByCategoryId(string $userId, $categoryId, bool $isOutOfDate, Database $db): array {
        $userId = $db->getConnection()->real_escape_string($userId);
        $categoryId = $db->getConnection()->real_escape_string($categoryId);

        $query = $isOutOfDate ?
            "SELECT a.id, a.title, a.description, a.views, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            WHERE a.user_id = $userId AND ac.category_id = $categoryId"
            :
            "SELECT a.id, a.title, a.description, a.views, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            WHERE a.user_id = $userId AND ac.category_id = $categoryId AND a.date_end >= CURDATE()";

        $data = $db->query($query);

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }

    /**
     * @throws Exception
     */
    public static function findAllAdsByCategoryIdAndSearch(
        string $userId,
        string $categoryId,
        string $search,
        bool $isOutOfDate,
        Database $db
    ): array {
        $userId = $db->getConnection()->real_escape_string($userId);
        $categoryId = $db->getConnection()->real_escape_string($categoryId);

        $query = $isOutOfDate ?
            "SELECT DISTINCT * FROM
            (SELECT DISTINCT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE a.user_id = $userId AND
                  ac.category_id = $categoryId AND
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
            WHERE a.user_id = $userId AND
                  ac.category_id = $categoryId AND
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
    public static function findAllAdsBySearch(
        string $userId,
        string $search,
        bool $isOutOfDate,
        Database $db
    ): array {
        $userId = $db->getConnection()->real_escape_string($userId);
        $search = $db->getConnection()->real_escape_string($search);

        $query = $isOutOfDate ?
            "SELECT DISTINCT * FROM
            (SELECT a.id, a.title, a.description, a.views, u.username, i.path
            FROM ad_categories ac
            JOIN ad a ON ac.ad_id = a.id
            JOIN user u ON a.user_id = u.id
            JOIN image i ON a.front_image_id = i.id
            JOIN category c ON ac.category_id = c.id
            WHERE a.user_id = $userId AND
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
                WHERE a.user_id = $userId AND
                      a.date_end >= CURDATE() AND
                      (a.title LIKE '%$search%' OR a.description LIKE '%$search%')
                ORDER BY a.date_end DESC) a";

        $data = $db->query($query);

        $ads = [];
        while ($ad = $data->fetch_object())
            $ads[] = $ad;

        return $ads;
    }
}