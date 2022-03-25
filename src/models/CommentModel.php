<?php

namespace App\models;

use Database;
use stdClass;

class CommentModel
{
    public string $adId,
        $email,
        $username,
        $body,
        $date,
        $ip;

    /**
     * @param string $adId
     * @param string $email
     * @param string $username
     * @param string $body
     * @param string $date
     * @param string $ip
     */
    public function __construct(
        string $adId,
        string $email,
        string $username,
        string $body,
        string $date,
        string $ip,
    )
    {
        $this->adId = $adId;
        $this->email = $email;
        $this->username = $username;
        $this->body = $body;
        $this->date = $date;
        $this->ip = $ip;
    }

    /**
     * @param string $adId
     * @param string $email
     * @param string $username
     * @param string $body
     * @param string $ip
     * @return void
     */
    public static function create(
        string $adId,
        string $email,
        string $username,
        string $body,
        string $ip,
    )
    {
        $db = (new Database)->getInstance();

        $adId = $db->real_escape_string($adId);
        $email = $db->real_escape_string($email);
        $username = $db->real_escape_string($username);
        $body = $db->real_escape_string($body);
        $ip = $db->real_escape_string($ip);

        $db->query(
            "INSERT INTO comment (ad_id, email, username, body, ip)
            VALUES ('$adId', '$email', '$username', '$body', '$ip')"
        );
    }

    /**
     * @param string $id
     * @return stdClass|null
     */
    public static function findOneById(string $id): ?stdClass
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);

        $data = $db->query("SELECT * FROM comment WHERE id = $id");
        $comment = $data->fetch_object();

        if (!$comment)
            return null;

        $comment = (array)$comment;
        $comment['country'] = getRequest("http://ip-api.com/json/${comment['ip']}")->country;
        return (object)$comment;
    }

    /**
     * @param string $adId
     * @return array
     */
    public static function findAllByAdId(string $adId): array
    {
        $db = (new Database)->getInstance();
        $adId = $db->real_escape_string($adId);

        $data = $db->query("SELECT * FROM comment WHERE ad_id = $adId ORDER BY date DESC");

        $comments = [];
        while ($comment = $data->fetch_object()) {
            $comment = (array)$comment;
            $comment['country'] = getRequest("http://ip-api.com/json/${comment['ip']}")->country;
            $comments[] = (object)$comment;
        }

        return $comments;
    }

    /**
     * @return array
     */
    public static function findLastFive(): array
    {
        $db = (new Database)->getInstance();

        $data = $db->query("SELECT * FROM comment ORDER BY date DESC LIMIT 5");

        $comments = [];
        while ($comment = $data->fetch_object()) {
            $comment = (array)$comment;
            $comment['country'] = getRequest("http://ip-api.com/json/${comment['ip']}")->country;
            $comments[] = (object)$comment;
        }

        return $comments;
    }

    /**
     * @param string $id
     * @return void
     */
    public static function deleteOneById(string $id)
    {
        $db = (new Database)->getInstance();
        $id = $db->real_escape_string($id);

        $db->query("DELETE FROM comment WHERE id = $id");
    }

    /**
     * @param string $username
     * @return array
     */
    public static function findAllByUsername(string $username): array
    {
        $db = (new Database)->getInstance();
        $username = $db->real_escape_string($username);

        $data = $db->query("SELECT * FROM comment WHERE username = '$username'");

        $comments = [];
        while ($comment = $data->fetch_object()) {
            $comment = (array)$comment;
            $comment['country'] = getRequest("http://ip-api.com/json/${comment['ip']}")->country;
            $comments[] = (object)$comment;
        }

        return $comments;
    }
}