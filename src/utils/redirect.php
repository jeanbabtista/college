<?php

use JetBrains\PhpStorm\NoReturn;

function redirectToIndex(): never {
    header("Location: /src/public");
    die();
}

function redirectToLogin(): never {
    header("Location: /src/public/auth/login.php");
    die();
}