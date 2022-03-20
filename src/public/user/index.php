<?php

use JetBrains\PhpStorm\ArrayShape;
use JetBrains\PhpStorm\Pure;

require_once __DIR__ . '/../partials/header.php';
require_once __DIR__ . '/../../models/user.php';
require_once __DIR__ . '/../../models/category.php';
require_once __DIR__ . '/../../utils/error.php';
require_once __DIR__ . '/../../utils/toast.php';
require_once __DIR__ . '/../../utils/responseObject.php';

global $db, $user;

#[Pure] #[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function validate(): array {
    if (!isset($_GET['id']))
        return getResponse(true, 'Query id is not present');
    return getResponse(false, '');
}

$userAds = [];
$title = "Browse through $user->username's ads";
$categories = [];
$fetchedUser = null;
$category = null;
$isOutOfDate = false;

try {
    if (!isset($_GET['id']))
        throw new Exception('Error: user id not present');

    $id = $_GET['id'];
    $categories = Category::findAll($db);
    $fetchedUser = User::findOneById($id, $db);

    if (isset($_GET['isOutOfDate']) && $_GET['isOutOfDate'] == "1")
        $isOutOfDate = true;

    if (isset($_GET['filter']) && isset($_GET['search'])) {
        $filter = $_GET['filter'];
        $search = $_GET['search'];

        $userAds = User::findAllAdsByCategoryIdAndSearch($fetchedUser->id, $filter, $search, $isOutOfDate, $db);

        $category = Category::findOneById($filter, $db)->title;
        $title = "Browse through $user->username's $category category and '$search'-like text";
    }
    else if (isset($_GET['filter']) && !isset($_GET['search'])) {
        $filter = $_GET['filter'];

        $userAds = User::findAllAdsByCategoryId($fetchedUser->id, $filter, $isOutOfDate, $db);

        $category = Category::findOneById($filter, $db)->title;
        $title = "Browse through $user->username's $category category";
    }
    else if (isset($_GET['search']) && !isset($_GET['filter'])) {
        $search = $_GET['search'];

        $userAds = User::findAllAdsBySearch($fetchedUser->id, $search, $isOutOfDate, $db);
        $title = "Browse through $user->username's '$search'-like ads";
    }
    else
        $userAds = User::findAllAds($id, $isOutOfDate, $db);
} catch (Throwable $e) {
    handleThrowable($e);
    return;
}

echo toast('validate') ?>

<?php if (!$fetchedUser) { ?>
    <h1 class="font-medium leading-tight text-3xl mt-0 mb-2 text-white mb-10">
        User with id <?php echo $_GET['id'] ?> does not exist.
    </h1>
<?php require_once __DIR__ . '/../partials/footer.php'; return; } ?>

<h1 class="font-medium text-3xl mt-0 mb-2 text-white mb-10"><?php echo strtoupper($title) ?></h1>

<button id="dropdownButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600
dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-8" type="button">
    Filter by category
    <svg
        class="ml-2 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
</button>

<a href="/src/public/user/index.php?id=<?php echo $fetchedUser->id ?>"
   class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200
    hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700
    dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700
    ml-2">
    Clear
</a>

<div class="flex items-start mb-6">
    <div class="flex items-center h-5">
        <input id="showPast" aria-describedby="showPast" type="checkbox" class="w-4 h-4 bg-gray-50 rounded border
    border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600
    dark:ring-offset-gray-800" required>
    </div>

    <div class="ml-3 text-sm">
        <label for="showPast" class="font-medium text-gray-900 dark:text-gray-300">Show ads out of date</label>
    </div>
</div>

<div id="dropdown" class="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow
    dark:bg-gray-700">
    <ul class="py-1" aria-labelledby="dropdownButton">
        <?php foreach ($categories as $category) { ?>
            <li class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200
            dark:hover:text-white">
                <a href="/src/public/user/index.php?id=<?php echo $fetchedUser->id ?>&filter=<?php echo $category->id ?>">
                    <?php echo $category->title ?>
                </a>
            </li>
        <?php } ?>
    </ul>
</div>

<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <?php foreach($userAds as $ad) { ?>
        <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <a href="/src/public/ad/index.php?id=<?php echo $ad->id;?>">
                <img class="rounded-t-lg"
                     src="<?php echo "../../../images/$fetchedUser->username/$ad->path" ?>"
                     alt="<?php echo $ad->title ?>" />
            </a>

            <div class="p-5">
                <a href="/src/public/ad/index.php?id=<?php echo $ad->id;?>">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <?php echo $ad->title ?>
                    </h5>
                </a>

                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"><?php echo $ad->description ?></p>

                <div class="flex justify-between">
                    <a href="/src/public/ad/index.php?id=<?php echo $ad->id;?>"
                       class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700
                           rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600
                           dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Read more
                        <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0
                            01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clip-rule="evenodd">
                            </path>
                        </svg>
                    </a>

                    <p class="mt-3 font-thin text-gray-400 dark:text-gray-400">Views: <?php echo $ad->views ?></p>
                </div>
            </div>
        </div>
    <?php } ?>
</div>

<?php require_once __DIR__ . '/../partials/footer.php';