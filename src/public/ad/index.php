<?php
require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/ad.php';

global $db;

function validate(): string {
    if (!isset($_GET['id']))
        return 'Error: query id is not present';
    return '';
}

try {
    if (validate()) {
        echo validate();
        return;
    }

    $id = $_GET['id'];
    $GLOBALS['ad']  = Ad::getOneById($id, $db);
} catch (Exception $e) {
    return $e->getMessage();
}

$ad = $GLOBALS['ad'];

?>
    <?php if (!$ad) { ?>
        <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">
            Ad with id <?php echo $_GET['id'] ?> does not exist.
        </h1>
    <?php return; } ?>

    <div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-1 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden">
            <img class="ad-image" src="<?php echo "../../../images/$ad->username/$ad->image" ?>" alt="<?php echo $ad->title ?>">
        </div>

        <div class="lg:col-span-2 border-gray-400 p-4 flex flex-col justify-between leading-normal">
            <div class="mb-8">
                <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Author</h1>
                <span class="text-white font-bold text-2xl mb-2"><?php echo $ad->username ?></span>
                <div class="my-10"></div>

                <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Title</h1>
                <span class="text-white font-bold text-2xl mb-2"><?php echo $ad->title ?></span>
                <div class="my-10"></div>

                <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Description</h1>
                <span class="text-white text-2xl mb-2"><?php echo $ad->description ?></span>
                <div class="my-10"></div>
            </div>
        </div>
    </div>

<?php require_once __DIR__ . '/../partials/footer.php' ?>