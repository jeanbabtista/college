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

global $user, $db;

$categories = [];
$images = [];

try {
    $categories = Category::findAll($db);
} catch (Exception $e) {
    echo $e->getMessage();
}

#[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function validate(): array {
    global $user;

    if (!isset($_POST['submit']))
        return getResponse(false, '');

    global $db;
    list(
        'title' => $title,
        'description' => $description,
        'categories' => $categories
    ) = $_POST;

    if (!$title)
        return getResponse(true, 'Title cannot be empty');
    if (!$description)
        return getResponse(true, 'Description cannot be empty');

    $images = $_FILES['images'];
    if (count($images['name']) == 1 && !$images['name'][0])
        return getResponse(true, 'Image cannot be empty');

    try {
        // front image
        $imagesNames = $images['name'];

        foreach ($imagesNames as $i => $imageName) {
            $imageName = basename($imageName);
            $imagesNames[$i] = $imageName;
            $imageAbsolutePath = "{$_SERVER['DOCUMENT_ROOT']}/images/$user->username/$imageName";
            move_uploaded_file($images['tmp_name'][$i], $imageAbsolutePath);
        }

        Ad::save($title, $description, $user->id, $imagesNames, $categories, $db);
        redirectToIndex();
    } catch (Exception $e) {
        return getResponse(true, $e->getMessage());
    }
}

?>

<?php echo toast('validate') ?>

<?php if (!$user) { ?>
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">You are not allowed to view this page.</h1>
<?php return; } ?>

    <div class="flex justify-center">
        <div class="max-w-md w-full space-y-8">
            <div>
                <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                     alt="Workflow">
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-200">
                    Publish ad
                </h2>
            </div>

            <form class="space-y-4" method="post" action="/src/public/ad/publish.php" enctype="multipart/form-data">
                <div class="mb-6">
                    <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        required
                </div>

                <div class="mb-6 mt-6">
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        Description *
                    </label>
                    <textarea id="description"
                              name="description"
                              rows="4"
                              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                dark:placeholder-white dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              required
                    ></textarea>
                </div>

                <div class="grid xl:grid-cols-2 xl:gap-6">
                    <div class="mb-6 z-0 w-full group">
                        <label for="images[]" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Select image * (at least one)
                        </label>
                        <input
                            id="images[]"
                            type="file"
                            name="images[]"
                            class="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-violet-50 file:text-violet-700
                                hover:file:bg-violet-100"
                            multiple
                        />
                    </div>

                    <div class="mb-6 z-0 w-full group">
                        <label for="categories[]" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Select category * (at least one)
                        </label>
                        <select
                            id="categories[]"
                            name="categories[]"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
                                focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            multiple>
                            <?php foreach ($categories as $category) { ?>
                                <option
                                        value="<?php echo $category->id ?>"
                                    <?php echo $category->id == 1 ? "selected" : "" ?>>
                                    <?php echo $category->title ?>
                                </option>
                            <?php } ?>
                        </select>
                    </div>
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

<?php include_once __DIR__ . '/../partials/footer.php' ?>