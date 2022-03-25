<?php

namespace App\controllers;

use App\models\UserModel;
use Exception;

class UserController
{
    public static function index()
    {
        try {
            if (!isset($_GET['id'])) {
                $user = getSessionUser();

                if (!$user->isAdmin)
                    throw new Exception('You are not allowed to view this page');

                $user = null;
                $ads = null;
                $users = UserModel::findAll();

                require_once __DIR__ . '/../views/user/index.php';
                return;
            }

            $user = UserModel::findOneById($_GET['id']);

            if (!$user)
                throw new Exception('User does not exist');

            $currentUser = getSessionUser();

            if (!$currentUser || !$currentUser->isAdmin && $user->id !== $currentUser->id)
                throw new Exception('You are not allowed to view this page');

            $ads = UserModel::findAllAds($user->id);
            $users = null;

            require_once __DIR__ . '/../views/user/index.php';
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }

    public static function edit()
    {
        $user = getSessionUser();

        if (!$user || !$user->isAdmin) {
            call('pages', 'error', 'You are not allowed to view this page');
            return;
        }

        if (!isset($_GET['id'])) {
            call('pages', 'error', 'User id is required for edit page');
            return;
        }

        $user = UserModel::findOneById($_GET['id']);

        if (!isset($_POST['submit'])) {
            require_once __DIR__ . '/../views/user/edit.php';
            return;
        }

        list(
            'username' => $username,
            'email' => $email,
            'fname' => $fname,
            'lname' => $lname,
            'address' => $address,
            'phone' => $phone,
            'post' => $post,
            'sex' => $sex,
            'age' => $age
            ) = $_POST;

        $isSuccessfulUpdate = UserModel::updateOneById(
            $user->id,
            $username,
            $email,
            $fname,
            $lname,
            $address,
            $phone,
            $post,
            $sex,
            $age
        );

        if ($isSuccessfulUpdate)
            call('pages', 'success', 'Successfully updated user');
        else
            call('pages', 'error', 'An error occurred when trying to update user');
    }

    public static function delete()
    {
        $user = getSessionUser();

        if (!$user || !$user->isAdmin) {
            call('pages', 'error', 'You are not allowed to view this page');
            return;
        }

        if (!isset($_GET['id'])) {
            call('pages', 'error', 'User id is required for delete page');
            return;
        }

        $isSuccessfulDelete = UserModel::deleteOneById($_GET['id']);

        if ($isSuccessfulDelete)
            call('pages', 'success', 'Successfully deleted user');
        else
            call('pages', 'error', 'An error occurred when trying to deleted user');
    }
}