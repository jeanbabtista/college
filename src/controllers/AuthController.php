<?php

namespace App\controllers;

use App\models\UserModel;
use Exception;

class AuthController
{
    public function login()
    {
        if (!isset($_POST['submit'])) {
            require_once __DIR__ . '/../views/auth/login.php';
            return;
        }

        if (!isset($_POST['username'])) {
            call('pages', 'error', 'Username cannot be empty');
            return;
        }

        if (!isset($_POST['password'])) {
            call('pages', 'error', 'Password cannot be empty');
            return;
        }

        list('username' => $username, 'password' => $password) = $_POST;

        try {
            $user = UserModel::findOneByUsernameAndPassword($username, $password);

            if (!$user) {
                call('pages', 'error', 'Login failed - wrong credentials');
                return;
            }

            setSessionUser($user);
            call('pages', 'success', 'Successfully logged in');
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
            return;
        }
    }

    public function register()
    {
        if (!isset($_POST['submit'])) {
            require_once __DIR__ . '/../views/auth/register.php';
            return;
        }

        list(
            'username' => $username,
            'email' => $email,
            'fname' => $fname,
            'lname' => $lname,
            'password' => $password,
            'repeat_password' => $repeat,
            'address' => $address,
            'phone' => $phone,
            'post' => $post,
            'sex' => $sex,
            'age' => $age
            ) = $_POST;

        if (!$username) {
            call('pages', 'error', 'Username cannot be empty');
            return;
        }

        if (!$email) {
            call('pages', 'error', 'Email cannot be empty');
            return;
        }

        if (!$fname) {
            call('pages', 'error', 'First name cannot be empty');
            return;
        }

        if (!$lname) {
            call('pages', 'error', 'Last name cannot be empty');
            return;
        }

        if (!$password) {
            call('pages', 'error', 'Password cannot be empty');
            return;
        }

        if ($password !== $repeat) {
            call('pages', 'error', 'Passwords do not match');
            return;
        }

        // check if user exists
        try {
            if (UserModel::findOneByUsername($username)) {
                call('pages', 'error', 'User already exists');
                return;
            }

            UserModel::create($username, $email, $fname, $lname, $password, $address, $phone, $post, $sex,
                intval($age));

            createDirectory("{$_SERVER['DOCUMENT_ROOT']}/images/$username");

            call('pages', 'success', 'Successfully registered user');
        } catch (Exception $e) {
            call('pages', 'error', $e->getMessage());
        }
    }

    public function logout()
    {
        require_once __DIR__ . '/../views/auth/logout.php';
    }
}