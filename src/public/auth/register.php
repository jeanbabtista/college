<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/user.php';
require_once __DIR__ . '/../../utils/redirect.php';
require_once __DIR__ . '/../../utils/responseObject.php';
require_once __DIR__ . '/../../utils/toast.php';

#[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function validate(): array
{
    if (!isset($_POST['submit']))
        return getResponse(false, '');

    global $db;
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

    if (!$username)
        return getResponse(true, 'Username cannot be empty');
    if (!$email)
        return getResponse(true, 'Email cannot be empty');
    if (!$fname)
        return getResponse(true, 'First name cannot be empty');
    if (!$lname)
        return getResponse(true, 'Last name cannot be empty');
    if (!$password)
        return getResponse(true, 'Password cannot be empty');
    if ($password !== $repeat)
        return getResponse(true, 'Passwords do not match');

    // check if user exists
    try {
        if (User::exists($username, $db))
            return getResponse(true, 'User already exists');

        User::register($username, $email, $fname, $lname, $password, $address, $phone, $post, $sex, intval($age), $db);
        createDirectory("{$_SERVER['DOCUMENT_ROOT']}/images/$username");

        redirectToLogin();
    } catch (Exception $e) {
        return getResponse(true, $e->getMessage());
    }
}

?>

<?php echo toast('validate') ?>

<div class="flex justify-center">
    <div class="max-w-md w-full space-y-8">
        <div>
            <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                 alt="Workflow">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-200">
                Register
            </h2>
            <p class="mt-2 text-center text-sm text-gray-200">
                Or
                <a href="/src/public/auth/login.php" class="font-medium text-indigo-600 hover:text-indigo-500">
                    login if you already have an account
                </a>
            </p>
        </div>

        <form class="space-y-4" method="post" action="/src/public/auth/register.php">
            <div class="mb-4">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Username *</label>
                <input type="text" id="username" name="username" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
            </div>

            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email *</label>
                <input type="email" id="email" name="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name.surname@gmail.com" required>
            </div>


            <div class="grid xl:grid-cols-2 xl:gap-6">
                <div class="z-0 w-full group">
                    <label for="fname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">First name *</label>
                    <input type="text" id="fname" name="fname" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
                </div>

                <div class="z-0 w-full group">
                    <label for="lname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Last name *</label>
                    <input type="text" id="lname" name="lname" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
                </div>
            </div>

            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Password *</label>
                <input type="password" id="password" name="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
            </div>

            <div class="mb-6">
                <label for="repeat_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Repeat password *</label>
                <input type="password" id="repeat_password" name="repeat_password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required>
            </div>

            <div class="grid xl:grid-cols-2 xl:gap-6">
                <div class="z-0 w-full group">
                    <label for="address" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Address</label>
                    <input type="text" id="address" name="address" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Cool street, 1234">
                </div>

                <div class="z-0 w-full group">
                    <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone</label>
                    <input type="text" id="phone" name="phone" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="123 456 789">
                </div>
            </div>

            <div class="grid xl:grid-cols-3 xl:gap-6">
                <div class="z-0 w-full group">
                    <label for="post" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Post</label>
                    <input type="text" id="post" name="post" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="5678">
                </div>

                <div class="z-0 w-full group">
                    <label for="sex" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Sex</label>
                    <select id="sex" name="sex" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                    </select>
                </div>

                <div class="z-0 w-full group">
                    <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Age</label>
                    <input type="number" id="age" name="age" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light">
                </div>
            </div>

            <button type="submit" name="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register new account</button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../partials/footer.php' ?>