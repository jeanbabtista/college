<?php

use JetBrains\PhpStorm\NoReturn;

#[NoReturn]
function redirectToIndex() {
    header("Location: /src/public");
    die();
}

#[NoReturn]
function redirectToLogin() {
    header("Location: /src/public/login.php");
    die();
}