<?php
require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/ad.php';
require_once __DIR__ . '/../../utils/files.php';
require_once __DIR__ . '/../../utils/redirect.php';

global $user, $db;

function validate(): string {
    global $user;

    if (!isset($_POST['submit']))
        return '';

    global $db;
    list('title' => $title, 'description' => $desc) = $_POST;
    $image = $_FILES['image'];

    if (!$title)
        return 'Error: title cannot be empty';
    if (!$desc)
        return 'Error: description cannot be empty';
    if (!$image)
        return 'Error: image cannot be empty';

    try {
        if (!$image['tmp_name'])
            return 'Error: image not found';

        $imageName = basename($image['name']);
        $imageAbsolutePath = "{$_SERVER['DOCUMENT_ROOT']}/images/$user->username/$imageName";
        move_uploaded_file($image['tmp_name'], $imageAbsolutePath);

        Ad::create($title, $desc, $imageName, $user->id, $db);

        redirectToIndex();
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

?>

<?php if (!$user) { ?>
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">You are not allowed to view this page.</h1>
<?php return; } ?>

    <div class="auth flex items-center justify-center">
        <div class="bg-white p-16 rounded shadow-2xl w-2/3">
            <h2 class="text-3xl font-bold mb-10 text-gray-800">Publish ad</h2>

            <form class="space-y-5" method="post" action="/src/public/ad/publish.php" enctype="multipart/form-data">
                <div>
                    <label for="title" class="block mb-1 font-bold text-gray-500">Title</label>
                    <input
                            id="title"
                            type="text"
                            name="title"
                            class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
                    />
                </div>
                <div>
                    <label for="description" class="block mb-1 font-bold text-gray-500">Description</label>
                    <input
                            id="description"
                            type="text"
                            name="description"
                            class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
                    />
                </div>
                <div>
                    <label for="image" class="block mb-1 font-bold text-gray-500">Image</label>
                    <input
                            id="image"
                            type="file"
                            name="image"
                            class="w-full border-2 border-gray-200 p-3 rounded outline-none focus:border-purple-500"
                    />
                </div>

                <button id="submit" name="submit" class="block w-full bg-yellow-400 hover:bg-yellow-300 p-4 rounded
                    text-yellow-900 hover:text-yellow-800 transition duration-300">
                    Publish
                </button>
            </form>

            <p><?php echo validate() ?></p>
        </div>
    </div>

<?php include_once __DIR__ . '/../partials/footer.php' ?>