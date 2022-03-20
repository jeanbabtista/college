<?php

require_once __DIR__ . './toast.php';

function handleThrowable(Throwable $e) {
    require_once __DIR__ . '/../public/partials/header.php';
    echo toastMessage(true, $e->getMessage());
    require_once __DIR__ . '/../public/partials/footer.php';
}
