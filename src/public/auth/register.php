<?php

require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/user.php';
require_once __DIR__ . '/../../utils/redirect.php';

function validate(): string {
    if (!isset($_POST['submit']))
        return '';

    global $db;
    list('username' => $username, 'password' => $password, 'repeat_password' => $repeat) = $_POST;

    if (!$username)
        return 'Error: username cannot be empty';
    if (!$password)
        return 'Error: password cannot be empty';
    if ($password !== $repeat)
        return 'Error: passwords do not match';

    // check if user exists
    try {
        if (User::exists($username, $db))
            return 'Error: user already exists';

        User::register($username, $password, $db);
        createDirectory("{$_SERVER['DOCUMENT_ROOT']}/images/$username");

        redirectToLogin();
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

?>

<div class="auth flex items-center justify-center">
    <div class="bg-white p-16 rounded shadow-2xl w-2/3">
        <h2 class="text-3xl font-bold mb-10 text-gray-800">Register</h2>

        <form class="space-y-5" method="post" action="/src/public/auth/register.php">
            <div>
                <label for="username" class="block mb-1 font-bold text-gray-500">Username</label>
                <input
                        id="username"
                        type="text"
                        name="username"
                        class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
                />
            </div>
            <div>
                <label for="password" class="block mb-1 font-bold text-gray-500">Password</label>
                <input
                        id="password"
                        type="password"
                        name="password"
                        class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
                />
            </div>
            <div>
                <label for="repeat_password" class="block mb-1 font-bold text-gray-500">Repeat password</label>
                <input
                        id="repeat_password"
                        type="password"
                        name="repeat_password"
                        class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
                />
            </div>

            <button id="submit" name="submit" class="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded
                    text-yellow-900 hover:text-yellow-800 transition duration-300">
                Sign Up
            </button>
        </form>

        <p><?php echo validate() ?></p>
    </div>
</div>

<?php require_once __DIR__ . '/../partials/footer.php' ?>