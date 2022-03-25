<?php

namespace App\controllers;

use App\models\AdModel;
use App\models\CategoryModel;
use App\models\CommentModel;
use Exception;

class AdController
{
    public static function index()
    {
        try {
            if (!isset($_GET['id']))
                throw new Exception('Query id is not present');

            $user = getSessionUser();

            list(
                'ad' => $ad,
                'categories' => $categories,
                'images' => $images
                ) = AdModel::findOneById($_GET['id']);

            if (!$ad)
                throw new Exception('Ad with id ' . $_GET['id'] . ' not found');

            AdModel::incrementViews($ad['id']);
            $comments = CommentModel::findAllByAdId($ad['id']);

            require_once __DIR__ . '/../views/ad/index.php';
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }

    public static function create()
    {
        try {
            $user = getSessionUser();

            if (!$user)
                throw new Exception('You cannot view this page');

            $categories = CategoryModel::findAll();

            if (!isset($_POST['submit'])) {
                require_once __DIR__ . '/../views/ad/create.php';
                return;
            }

            list(
                'title' => $title,
                'description' => $description,
                'categories' => $categories
                ) = $_POST;

            if (!$title)
                throw new Exception('Title cannot be empty');

            if (!$description)
                throw new Exception('Description cannot be empty');

            $images = $_FILES['images'];
            if (count($images['name']) == 1 && !$images['name'][0])
                throw new Exception('Image cannot be empty');

            // front image
            $imagesNames = $images['name'];

            foreach ($imagesNames as $i => $imageName) {
                $imageName = basename($imageName);
                $imagesNames[$i] = $imageName;
                $imageAbsolutePath = "{$_SERVER['DOCUMENT_ROOT']}/images/$user->username/$imageName";
                move_uploaded_file($images['tmp_name'][$i], $imageAbsolutePath);
            }

            AdModel::create($title, $description, $user->id, $imagesNames, $categories);

            call('pages', 'success', 'Successfully published ad');
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }

    public static function edit()
    {
        try {
            if (!isset($_GET['id']))
                throw new Exception('Ad id not present');

            $ad = AdModel::findOneById($_GET['id'])['ad'];
            $categories = CategoryModel::findAll();

            if (!isset($_POST['submit'])) {
                require_once __DIR__ . '/../views/ad/edit.php';
                return;
            }

            if (!$ad)
                throw new Exception('Ad does not exist');

            $user = getSessionUser();

            if (!$user)
                throw new Exception('You cannot view this page');

            if ($ad['userId'] != $user->id)
                throw new Exception('You cannot view this page');

            list(
                'title' => $title,
                'description' => $description,
                'date' => $dateEnd
                ) = $_POST;

            if (!$title)
                throw new Exception('Title cannot be empty');

            if (!$description)
                throw new Exception('Description cannot be empty');

            AdModel::updateOneById($ad['id'], $title, $description, $dateEnd);

            call('pages', 'success', 'Successfully updated ad');
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }

    public static function delete()
    {
        try {
            if (!isset($_GET['id']))
                throw new Exception('Ad id not present');

            $currentUser = getSessionUser();

            if (!$currentUser)
                throw new Exception('You are not allowed to view this page');

            $ad = AdModel::findOneById($_GET['id'])['ad'];

            if (!$ad)
                throw new Exception('Ad does not exist');

            if ($ad['userId'] != $currentUser->id)
                throw new Exception('You are not allowed to perform this operation');

            $status = AdModel::deleteOneById($_GET['id']);

            if (!$status)
                throw new Exception('An error occurred while deleting the ad');

            call('pages', 'success', 'Successfully deleted ad');
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }
}