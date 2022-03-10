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

<h1>Hello, <?php echo $user ? $user->username : 'Please log in'?>!</h1>

<?php foreach($ads as $ad) { ?>
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img width=400 height=100 content="object-fit" src="<?php echo $ad->image ?>" alt="<?php echo $ad->title ?>">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2"><?php echo $ad->title ?></div>
            <p class="text-gray-700 text-base"><?php echo $ad->description ?></p>
            <a href="/src/public/ad/publish.php?id=<?php echo $ad->id;?>">Read more</a>
        </div>
        <div class="px-6 pt-4 pb-2">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
        </div>
    </div>
<?php }

require_once __DIR__ . './partials/footer.php';