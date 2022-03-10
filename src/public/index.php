<?php
require_once __DIR__ . './partials/header.php';
require_once __DIR__ . '/../models/ad.php';

global $user, $db;

$ads = [];
try {
    $ads = Ad::getAll($db);
} catch (Exception $e) {
    echo $e->getMessage();
}

?>

<h1 class="font-medium text-3xl mt-0 mb-2 text-white mb-10">Browse through ads near your town</h1>

<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
<?php foreach($ads as $ad) { ?>
    <div class="justify-center max-w-sm rounded overflow-hidden shadow-xl">
        <img width=400 height=100 content="object-fit" src="<?php echo "../../images/$ad->username/$ad->image" ?>" alt="<?php echo $ad->title ?>">
        <div class="h-24 px-6 py-4 bg-white overflow-hidden">
            <div class="font-bold text-xl mb-2"><?php echo $ad->title ?></div>
            <p class="text-gray-700 text-base"><?php echo $ad->description ?></p>
        </div>

        <hr/>

        <div class="flex justify-between px-6 pt-4 pb-6 bg-white">
            <span class="bg-gray-200 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 mr-2 mb-2">
                <?php echo $ad->username ?>
            </span>
            <a href="/src/public/ad/index.php?id=<?php echo $ad->id;?>" class="self-end">
                <button class="text-center text-white rounded-full p-3 focus:outline-none bg-gray-800">Read more</button>
            </a>
        </div>
    </div>
<?php } ?>
</div>

<?php require_once __DIR__ . './partials/footer.php' ?>
