<?php list('ads' => $ads, 'categories' => $categories, 'comments' => $comments, 'user' => $user) = get_defined_vars() ?>

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

<a href="<?php echo getQuery('pages', 'index') ?>"
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
                <a href="<?php echo getQuery('pages', 'index', [['filter', $category->id]]) ?>">
                    <?php echo $category->title ?>
                </a>
            </li>
        <?php } ?>
    </ul>
</div>

<div class="mb-10">
    <h1 class="text-white text-2xl">Last five comments</h1>
    <?php foreach ($comments as $comment) { ?>
        <div class="flex justify-between rounded border border-gray-600 mb-2 p-5">
            <div>
                <a href="<?php echo getQuery('ad', 'index', [['id', $comment->ad_id]]) ?>"
                   class="text-gray-500">
                    <h1 class="font-semibold text-white text-2xl"><?php echo $comment->username ?></h1>
                    <p class="text-white"><?php echo $comment->body ?></p>
                    <p class="text-gray-500 mt-5"><?php echo $comment->country ?></p>
                </a>
            </div>

            <?php if ($user && $user->username === $comment->username) { ?>
                <a href="<?php echo getQuery('comment', 'delete', [['id', $comment->id]]) ?>"
                   class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium
                       rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                       dark:focus:ring-red-900 self-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0
                    0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4
                    7h16">
                        </path>
                    </svg>
                </a>
            <?php } ?>
        </div>
    <?php } ?>
</div>

<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
    <?php foreach ($ads as $ad) { ?>
        <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800
        dark:border-gray-700">
            <a href="<?php echo getQuery('ad', 'index', [['id', $ad->id]]) ?>">
                <img class="rounded-t-lg" src="<?php echo "../../images/$ad->username/$ad->path" ?>"
                     alt="<?php echo $ad->title ?>"/>
            </a>

            <div class="p-5">
                <a href="<?php echo getQuery('ad', 'index', [['id', $ad->id]]) ?>">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <?php echo $ad->title ?>
                    </h5>
                </a>

                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400"><?php echo $ad->description ?></p>

                <div class="flex justify-between">
                    <a href="<?php echo getQuery('ad', 'index', [['id', $ad->id]]) ?>"
                       class="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700
                   rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700
                   dark:focus:ring-blue-800">
                        Read more
                        <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6
                         6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0
                         010-1.414z" clip-rule="evenodd">
                            </path>
                        </svg>
                    </a>

                    <p class="mt-3 font-thin text-gray-400 dark:text-gray-400">Views: <?php echo $ad->views ?></p>
                </div>
            </div>
        </div>
    <?php } ?>
</div>