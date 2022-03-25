<?php

namespace App\models;

use Database;
use stdClass;

class UserModel
{
    public string $id,
        $username,
        $email,
        $fname,
        $lname,
        $password,
        $address,
        $post,
        $phone,
        $sex;
    public int $age;
    public bool $isAdmin;

    public function __construct(
        string $id,
        string $username,
        string $email,
        string $fname,
        string $lname,
        string $password,
        string $address,
        string $post,
        string $phone,
        string $sex,
        int    $age,
        bool   $isAdmin,
    )
    {
        $this->id = $id;
        $this->username = $username;
        $this->email = $email;
        $this->fname = $fname;
        $this->lname = $lname;
        $this->password = $password;
        $this->address = $address;
        $this->post = $post;
        $this->phone = $phone;
        $this->sex = $sex;
        $this->age = $age;
        $this->isAdmin = $isAdmin;
    }

    /**
     * @param string $username
     * @return stdClass|null
     */
    public static function findOneByUsername(string $username): ?stdClass
    {
        $db = (new Database)->getInstance();

        $data = $db->query(
            "SELECT * FROM user WHERE username='" . $db->real_escape_string($username) . "'"
        );

        if (!$data)
            return null;

        return $data->fetch_object();
    }

    /**
     * @param string $username
     * @param string $email
     * @param string $fname
     * @param string $lname
     * @param string $password
     * @param string $address
     * @param string $phone
     * @param string $post
     * @param string $sex
     * @param int $age
     * @return void
     */
    public static function create(
        string $username,
        string $email,
        string $fname,
        string $lname,
        string $password,
        string $address,
        string $phone,
        string $post,
        string $sex,
        int    $age
    )
    {
        $db = (new Database)->getInstance();
        $username = $db->real_escape_string($username);
        $email = $db->real_escape_string($email);
        $fname = $db->real_escape_string($fname);
        $lname = $db->real_escape_string($lname);
        $password = sha1($password);
        $address = $db->real_escape_string($address);
        $phone = $db->real_escape_string($phone);
        $post = $db->real_escape_string($post);
        $sex = $db->real_escape_string($sex);

        $db->query(
            "INSERT INTO user (username, email, fname, lname, password, address, phone, post, sex, age) VALUES
            ('$username', '$email', '$fname', '$lname', '$password', '$address', '$phone', '$post', '$sex', '$age')"
        );
    }

    /**
     * @param string $username
     * @param string $password
     * @return stdClass|null
     */
    public static function findOneByUsernameAndPassword(string $username, string $password): ?stdClass
    {
        $db = (new Database)->getInstance();
        $username = $db->real_escape_string($username);
        $password = sha1($password);

        $data = $db->query("SELECT * FROM user WHERE username='$username' AND password='$password'");
        $user = $data->fetch_object();

        return $user ?: null;
    }

    /**
     * @return array
     */
    public static function findAll(): array
    {
        $db = (new Database)->getInstance();
        $data = $db->query("SELECT * FROM user");

        $users = [];
        while ($user = $data->fetch_object()) {
            $user = (array)$user;
            $user['count'] = UserModel::countAllAdsByUserId($user['id']);
            $users[] = (object)$user;
        }

        return $users;
    }

    public static function countAllAdsByUserId(string $id): ?int
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);

        $data = $db->query("SELECT COUNT(user_id) as count FROM ad WHERE user_id = $id GROUP BY user_id");

        if (!$data)
            return null;

        $data = $data->fetch_object();

        return $data ? $data->count : 0;
    }

    /**
     * @param string $id -> user id
     * @param string $username
     * @param string $email
     * @param string $fname
     * @param string $lname
     * @param string $address
     * @param string $phone
     * @param string $post
     * @param string $sex
     * @param int $age
     * @return bool
     */
    public static function updateOneById(
        string $id,
        string $username,
        string $email,
        string $fname,
        string $lname,
        string $address,
        string $phone,
        string $post,
        string $sex,
        int    $age
    ): bool
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);
        $username = $db->real_escape_string($username);
        $email = $db->real_escape_string($email);
        $fname = $db->real_escape_string($fname);
        $lname = $db->real_escape_string($lname);
        $address = $db->real_escape_string($address);
        $phone = $db->real_escape_string($phone);
        $post = $db->real_escape_string($post);
        $sex = $db->real_escape_string($sex);

        // update ad
        $db->query(
            "UPDATE user
            SET username = '$username',
                email = '$email',
                fname = '$fname',
                lname = '$lname',
                address = '$address',
                phone = '$phone',
                post = '$post',
                sex = '$sex',
                age = '$age'
            WHERE id = $id"
        );

        return !$db->errno;
    }

    /**
     * @param string $id
     * @return bool
     */
    public static function deleteOneById(string $id): bool
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);

        // delete comments
        $user = UserModel::findOneById($id);
        $comments = CommentModel::findAllByUsername($user->username);

        foreach ($comments as $comment)
            CommentModel::deleteOneById($comment->id);

        // delete ads
        $ads = UserModel::findAllAds($id);

        foreach ($ads as $ad)
            AdModel::deleteOneById($ad->id);

        // delete user
        $db->query("DELETE FROM user WHERE id = $id");

        return !$db->errno;
    }

    /**
     * @param string $id
     * @return stdClass|null
     */
    public static function findOneById(string $id): ?stdClass
    {
        $db = (new Database)->getInstance();
        $data = $db->query("SELECT * FROM user WHERE id = '" . $db->real_escape_string($id) . "'");
        $user = $data->fetch_object();

        return $user ?: null;
    }

    /**
     * @param string $id -> user id
     * @param bool $isOutOfDate
     * @return array
     */
    public static function findAllAds(string $id, bool $isOutOfDate = false): array
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);

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
}