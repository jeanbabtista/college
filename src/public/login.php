<?php

include_once './partials/header.php';
require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../utils/redirect.php';

function validate(): string {
    if (!isset($_POST['submit']))
        return "";

    global $db;
    list('username' => $username, 'password' => $password) = $_POST;

    // check username
    if (!$username)
        return 'Error: username cannot be empty';

    // check password
    if (!$password)
        return 'Error: password cannot be empty';

    list ('error' => $error, 'message' => $message, 'data' => $data) = User::login($username, $password, $db);

    if ($error)
        return $message;

    $user = $data;
    if (!$user)
        return 'Error: login failed';

    $_SESSION['USER_ID'] = $user;
    redirectToIndex();
}

?>

    <div class="auth flex items-center justify-center mt-28">
        <div class="bg-white p-16 rounded shadow-2xl w-2/3">
            <h2 class="text-3xl font-bold mb-10 text-gray-800">Login</h2>

            <form class="space-y-5" method="post" action="/src/public/login.php">
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

                <button id="submit" name="submit" class="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded
                    text-yellow-900 hover:text-yellow-800 transition duration-300">
                    Log in
                </button>
            </form>

            <p><?php echo validate() ?></p>
        </div>
    </div>

<?php include_once './partials/footer.php' ?>