<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/ad.php';
require_once __DIR__ . '/../../models/category.php';
require_once __DIR__ . '/../../models/image.php';
require_once __DIR__ . '/../../utils/files.php';
require_once __DIR__ . '/../../utils/responseObject.php';
require_once __DIR__ . '/../../utils/toast.php';
require_once __DIR__ . '/../../utils/error.php';

global $user, $db;

$adId = null;
$ad = null;

try {
    if (!isset($_GET['id']))
        throw new Exception('Error: ad id not present');

    $adId = $_GET['id'];
    $ad = Ad::findOneById($adId, $db)['ad'];
} catch (Throwable $e) {
    handleThrowable($e);
    return;
}

#[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function validate(): array {
    try {
        if (!isset($_GET['id']))
            throw new Exception('Error: ad id not present');

        global $db;
        $adId = $_GET['id'];

        $status = Ad::deleteOneById($adId, $db);

        if ($status)
            return getResponse(false, 'Successfully deleted ad');
        else
            return getResponse(true, 'Ad does not exist');
    } catch (Exception $e) {
        return getResponse(true, $e->getMessage());
    }
}

echo toast('validate') ?>

<?php if (!$user) { ?>
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">You are not allowed to view this page.</h1>
    <?php require_once __DIR__ . '/../partials/footer.php'; return; } ?>

<?php if (!$ad) { ?>
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">Add does not exist.</h1>
    <?php require_once __DIR__ . '/../partials/footer.php'; return; } ?>

<?php if ($ad['userId'] != $user->id) { ?>
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">You are not allowed to delete this ad.</h1>
    <?php require_once __DIR__ . '/../partials/footer.php'; return; } ?>

<?php require_once __DIR__ . '/../partials/footer.php';