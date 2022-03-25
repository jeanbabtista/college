<?php list('user' => $user, 'ads' => $ads, 'users' => $users) = get_defined_vars() ?>

<?php if ($user) { ?>
    <div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <?php foreach ($ads as $ad) { ?>
            <div class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800
            dark:border-gray-700">
                <a href="<?php echo getQuery('ad', 'index', [['id', $ad->id]]) ?>">
                    <img class="rounded-t-lg"
                         src="<?php echo "../../../images/$user->username/$ad->path" ?>"
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
                           class="inline-flex items-center py-2 px-3 text-sm font-medium text-center
                           text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
                           dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Read more
                            <svg class="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1
                                    0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
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
    <?php return;
} ?>

<?php if ($users) { ?>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg my-10">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Username
                </th>
                <th scope="col" class="px-6 py-3">
                    Email
                </th>
                <th scope="col" class="px-6 py-3">
                    Ad count
                </th>
                <th scope="col" class="px-6 py-3">
                    <span class="sr-only">Edit</span>
                </th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($users as $user) { ?>
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <a href="<?php echo getQuery('user', 'index', [['id', $user->id]]) ?>">
                            <?php echo $user->username ?>
                        </a>
                    </th>
                    <td class="px-6 py-4">
                        <?php echo $user->email ?>
                    </td>
                    <td class="px-6 py-4">
                <span class="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded
                dark:bg-gray-700 dark:text-gray-300">
                    <?php echo $user->count ?>
                </span>
                    </td>
                    <td class="px-6 py-4 text-right flex justify-center h-100">
                        <a href="<?php echo getQuery('user', 'edit', [['id', $user->id]]) ?>"
                           type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
                           focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600
                           dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0
                                      112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                </path>
                            </svg>
                        </a>

                        <button class="block text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none
                        focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600
                        dark:hover:bg-red-700 dark:focus:ring-red-800 ml-3"
                                type="button"
                                data-modal-toggle="popup-modal">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                                      4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                </path>
                            </svg>
                        </button>
                    </td>
                </tr>
            <?php } ?>
            </tbody>
        </table>
    </div>
<?php } ?>

<div id="popup-modal" tabindex="-1"
     class="hidden overflow-y-auto overflow-x-hidden fixed top-50 left-0 right-0 z-50 h-modal md:h-full w-full
        justify-center">
    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex justify-end p-2">
                <button type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm
                        p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                        data-modal-toggle="popup-modal">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293
                              4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293
                              5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>

            <div class="p-6 pt-0 text-center">
                <svg class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete
                    this user?</h3>
                <a href="<?php echo getQuery('user', 'delete', [['id', $user->id]]) ?>"
                   data-modal-toggle="popup-modal" type="button"
                   class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300
                        dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5
                        text-center mr-2">
                    Yes, I'm sure
                </a>
                <button data-modal-toggle="popup-modal" type="button"
                        class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none
                        focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5
                        hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500
                        dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    No, cancel
                </button>
            </div>
        </div>
    </div>
</div>