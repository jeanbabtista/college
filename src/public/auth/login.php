<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../../models/user.php';
require_once __DIR__ . '/../../utils/redirect.php';
require_once __DIR__ . '/../../utils/toast.php';
require_once __DIR__ . '/../../utils/responseObject.php';

#[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function validate(): array {
    if (!isset($_POST['submit']))
        return getResponse(false, '');

    global $db;
    list('username' => $username, 'password' => $password) = $_POST;

    if (!$username)
        return getResponse(true, 'Username cannot be empty');
    if (!$password)
        return getResponse(true, 'Password cannot be empty');

    try {
        $user = User::login($username, $password, $db);
        if (!$user)
            return getResponse(true, 'Login failed');

        $_SESSION['USER_ID'] = $user;

        redirectToIndex();
    } catch (Exception $e) {
        return getResponse(true, $e->getMessage());
    }
}

?>

<?php require_once __DIR__ . '/../partials/header.php'; ?>

<?php echo toast('validate') ?>

<div class="flex justify-center">
    <div class="max-w-md w-full space-y-8">
        <div>
            <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                 alt="Workflow">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-200">
                Login
            </h2>
            <p class="mt-2 text-center text-sm text-gray-200">
                Or
                <a href="/src/public/auth/register.php" class="font-medium text-indigo-600 hover:text-indigo-500">
                    register if you don't have an account
                </a>
            </p>
        </div>

        <form class="space-y-4" method="post" action="/src/public/auth/login.php">
            <div class="mb-4">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Username
                </label>
                <input type="text" id="username" name="username" class="shadow-sm bg-gray-50 border border-gray-300
                text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                dark:focus:border-blue-500 dark:shadow-sm-light" required>
            </div>

            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Password
                </label>
                <input type="password" id="password" name="password" class="shadow-sm bg-gray-50 border border-gray-300
                text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                dark:focus:border-blue-500 dark:shadow-sm-light" required>
            </div>

            <button type="submit" name="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
                focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600
                dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Login
            </button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/../partials/footer.php' ?>