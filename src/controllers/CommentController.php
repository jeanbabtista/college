<?php

namespace App\controllers;

use App\models\CommentModel;
use App\models\UserModel;
use Exception;
use Throwable;

class CommentController
{
    public static function index()
    {
        $data = CommentModel::findLastFive();
        $code = 200;
        require_once __DIR__ . '/../views/comment/index.php';
    }

    public static function create()
    {
        try {
            $data = json_decode(file_get_contents('php://input'));

            if (!$data)
                throw new Exception('You have to provide username, email and comment');

            if (!isset($data->adId) || !isset($data->username) || !isset($data->email) || !isset($data->comment) ||
                !isset($data->ip))
                throw new Exception('All fields must be filled');

            $adId = $data->adId;
            $username = $data->username;
            $email = $data->email;
            $comment = $data->comment;
            $ip = $data->ip;

            if (!$adId || !$username || !$email || !$comment || !$ip)
                throw new Exception('All fields must be filled');

            $response = getRequest(
                "http://apilayer.net/api/check?access_key=d6e5afc309c4fa435031d256fe7ed3c8&email=$email&smtp=1&format=1"
            );

            if (isset($response->success) && $response->success == false)
                throw new Exception('Email is invalid');

            CommentModel::create($adId, $email, $username, $comment, $ip);

            $data = [getResponse('Successfully created comment')];
            $code = 200;
            require_once __DIR__ . '/../views/comment/create.php';
        } catch (Throwable $e) {
            $data = [getResponse($e->getMessage(), true)];
            $code = 401;
            require_once __DIR__ . '/../views/comment/create.php';
        }
    }

    public static function delete()
    {
        try {
            if (!isset($_GET['id']))
                throw new Exception('Query parameter ID must be present');

            $comment = CommentModel::findOneById($_GET['id']);

            if (!$comment)
                throw new Exception('Comment does not exist');

            $currentUser = getSessionUser();
            $user = UserModel::findOneByUsername($comment->username);

            if ($currentUser->id !== $user->id)
                throw new Exception('You do not have permission to do that');

            CommentModel::deleteOneById($_GET['id']);

            $data = [getResponse('Successfully deleted comment')];
            $code = 200;
            require_once __DIR__ . '/../views/comment/delete.php';
        } catch (Throwable $e) {
            $data = [getResponse($e->getMessage(), true)];
            $code = 401;
            require_once __DIR__ . '/../views/comment/delete.php';
        }
    }
}