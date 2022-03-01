<?php

include_once './partials/header.php';
require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../utils/redirect.php';

function validate(): string {
    if (!isset($_POST['submit']))
        return "";

    global $db;
    list('username' => $username, 'password' => $password, 'repeat_password' => $repeat) = $_POST;

    // check username
    if (!$username)
        return 'Error: username cannot be empty';

    // check passwords
    if ($password !== $repeat)
        return 'Error: passwords do not match';

    // check if user exists
    list ('error' => $_error, 'message' => $message, 'data' => $data) = User::exists($username, $db);

    if ($_error)
        return $message;

    if (!$data)
        return 'Error: unknown error - data does not exist';

    if ($data->num_rows)
        return 'Error: username already exists';

    // register user
    User::register($username, $password, $db);
    redirectToLogin();
}

validate();
?>

<div class="flex items-center justify-center" id="register">
    <div class="bg-white p-16 rounded shadow-2xl w-2/3">
        <h2 class="text-3xl font-bold mb-10 text-gray-800">Register</h2>

        <form class="space-y-5" method="post" action="/src/public/register.php">
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

<?php include_once './partials/footer.php' ?>