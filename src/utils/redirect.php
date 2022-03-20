<?php

function redirectToIndex(): never {
    header("Location: /src/public/index.php");
    die();
}

function redirectToLogin(): never {
    header("Location: /src/public/auth/login.php");
    die();
}