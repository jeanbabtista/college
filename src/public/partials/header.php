<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/session.php';

// connect to database
$db = new Database();

try {
    $db->connect();
} catch (Exception $e) {
    echo $e->getMessage();
}

// initialize session
session_start();
if (isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] < 1800)
    session_regenerate_id(true);
$_SESSION['LAST_ACTIVITY'] = time();

// get user from session (if exists)
$user = getUserFromSession();

?>

<html lang="eng">
<head>
    <title>Web Programming Exercise 1</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- <link rel="stylesheet" href="/src/public/styles/style.css" /> -->
</head>
<body>
<nav class="flex items-stretch bg-gray-900 h-16">
    <div class="flex items-stretch self-center justify-start">
        <h1 class="text-white text-2xl px-2">Web Programming Exercise 1</h1>

        <div class="flex space-x-4 self-center">
            <a href="/src/public/index.php"
               class="text-gray-300 hover:bg-gray-700 hover:text-white ml-6 px-2 py-2 rounded-md font-medium">Home</a>

            <?php if (isset($_SESSION["USER_ID"])) { ?>
                <a href="/src/public/ad/publish.php"
                   class="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md font-medium">Publish
                    new ad</a>
                <a href="/src/public/auth/logout.php"
                   class="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md font-medium">Logout</a>
            <?php } else { ?>
                <a href="/src/public/auth/login.php"
                   class="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md font-medium">Login</a>
                <a href="/src/public/auth/register.php"
                   class="text-gray-300 hover:bg-gray-700 hover:text-white px-2 py-2 rounded-md font-medium">Register</a>
            <?php } ?>
        </div>
    </div>
</nav>

<main class="mt-5">