<?php

use JetBrains\PhpStorm\ArrayShape;

require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/ad.php';
require_once __DIR__ . '/../../models/category.php';
require_once __DIR__ . '/../../models/image.php';
require_once __DIR__ . '/../../utils/files.php';
require_once __DIR__ . '/../../utils/redirect.php';
require_once __DIR__ . '/../../utils/responseObject.php';
require_once __DIR__ . '/../../utils/toast.php';
require_once __DIR__ . '/../../utils/error.php';

global $user, $db;

$categories = [];
$images = [];
$adId = null;
$ad = null;

try {
    if (isset($_GET['id']))
        $adId = $_GET['id'];

    if (!isset($_GET['id']) || !$adId)
        throw new Exception('Error: ad id not present');

    $ad = Ad::findOneById($adId, $db)['ad'];
    $categories = Category::findAll($db);
} catch (Throwable $e) {
    handleThrowable($e);
    return;
}

#[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function validate(): array {
    if (!isset($_POST['submit']))
        return getResponse(false, '');

    global $db;
    list(
        'title' => $title,
        'description' => $description,
        'date' => $dateEnd
    ) = $_POST;

    if (!$title)
        return getResponse(true, 'Title cannot be empty');
    if (!$description)
        return getResponse(true, 'Description cannot be empty');

    try {
        global $adId;

        Ad::updateOneById($adId, $title, $description, $dateEnd, $db);

        // redirectToIndex();
        return getResponse(false, 'Successfully updated ad');
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
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">You are not allowed to edit this ad.</h1>
<?php require_once __DIR__ . '/../partials/footer.php'; return; } ?>

<div class="flex justify-center">
    <div class="max-w-md w-full space-y-8">
        <div>
            <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                 alt="Workflow">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-200">
                Edit ad
            </h2>
        </div>

        <form class="space-y-4" method="post" action="/src/public/ad/edit.php?id=<?php echo $adId?>"
              enctype="multipart/form-data">
            <div class="mb-6">
                <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                        focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    value="<?php echo $ad['title']?>"
                    required
            </div>

            <div class="mb-6 mt-6">
                <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Description
                </label>
                <textarea id="description"
                          name="description"
                          rows="4"
                          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                            focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                            dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                ><?php echo $ad['description']?></textarea>
            </div>

            <label for="date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Valid until
            </label>

            <div class="mb-6 relative">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0
                         00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0
                         5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                </div>

                <input datepicker name="date" id="date" type="text" class="bg-gray-50 border border-gray-300
                    text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10
                    p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date"
                    value="<?php echo date("m/d/Y", strtotime($ad['date_end']))?>">
            </div>

            <div class="mt-8 flex justify-center">
                <button
                    type="submit"
                    name="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg
                        text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Publish
                </button>
            </div>
        </form>
    </div>
</div>

<?php include_once __DIR__ . '/../partials/footer.php';