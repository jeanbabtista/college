<?php list(
    'ad' => $ad,
    'categories' => $categories,
    'images' => $images,
    'user' => $user,
    'comments' => $comments
    ) = get_defined_vars() ?>

<div class="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="lg:col-span-1 border-gray-400 p-4 flex flex-col justify-between leading-normal">
        <div class="mb-8">
            <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Author & Email</h1>

            <a href="<?php echo getQuery('user', 'index', [['id', $ad['userId']]]) ?>"
               class="text-white font-bold text-2xl mb-2 mr-2">
                <?php echo $ad['username'] ?>
            </a>

            <a href="mailto:<?php echo $ad['email'] ?>"
               class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded
                   dark:bg-yellow-200 dark:text-yellow-900">
                <?php echo $ad['email'] ?>
            </a>

            <div class="my-10"></div>

            <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Title</h1>
            <span class="text-white font-bold text-2xl mb-2"><?php echo $ad['title'] ?></span>
            <div class="my-10"></div>

            <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Description</h1>
            <span class="text-white text-2xl mb-2"><?php echo $ad['description'] ?></span>
            <div class="my-10"></div>

            <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Valid until</h1>
            <span class="block text-white text-2xl mb-2">
                    <?php echo date("d. M. Y", strtotime($ad['date_end'])) ?>
                </span>
            <div class="my-10"></div>

            <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Categories</h1>
            <?php foreach ($categories as $category) { ?>
                <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded
                    dark:bg-blue-200 dark:text-blue-800">
                    <?php echo $category ?>
                </span>
            <?php } ?>
            <div class="my-10"></div>

            <h1 class="font-medium leading-tight text-2xl mt-0 mb-2 text-gray-600">Views</h1>
            <span class="text-white text-2xl mb-2"><?php echo $ad['views'] ?></span>
            <div class="my-10"></div>
        </div>
    </div>

    <?php if (count($images) > 1) { ?>
        <div id="default-carousel" data-carousel="slide" class="lg:col-span-2 relative">
            <div class="overflow-hidden relative rounded-lg h-96 lg:h-full">
                <?php foreach ($images as $image) { ?>
                    <div class="hidden duration-1000 ease-in-out" data-carousel-item="active">
                        <img class="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                             src="<?php echo "../../../images/${ad['username']}/$image" ?>"
                             alt="<?php echo $image ?>">
                    </div>
                <?php } ?>
            </div>

            <div class="flex absolute bottom-5 left-1/2 space-x-3 -translate-x-1/2">
                <?php foreach ($images as $i => $image) { ?>
                    <button type="button"
                            class="w-3 h-3 rounded-full
                                    <?php if ($i != 0) { ?>
                                        bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800
                                    <?php } else { ?>
                                        dark:bg-gray-800
                                    <?php } ?>"
                            aria-current="false"
                            aria-label="Slide <?php echo $i + 1 ?>"
                            data-carousel-slide-to="<?php echo $i ?>">
                    </button>
                <?php } ?>
            </div>

            <button type="button"
                    class="flex absolute top-0 left-0 justify-center items-center px-4 h-full cursor-pointer group
                        focus:outline-none"
                    data-carousel-prev>
        <span class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30
        dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4
        group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="2"
                      d="M15 19l-7-7 7-7"></path></svg>
            <span class="hidden">Previous</span>
        </span>
            </button>

            <button type="button"
                    class="flex absolute top-0 right-0 justify-center items-center px-4 h-full cursor-pointer group
                        focus:outline-none"
                    data-carousel-next>
        <span class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30
        dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4
        group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-5 h-5 text-white sm:w-6 sm:h-6 dark:text-gray-800" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="2"
                      d="M9 5l7 7-7 7"></path></svg>
            <span class="hidden">Next</span>
        </span>
            </button>
        </div>
    <?php } else { ?>
        <div class="lg:col-span-2 relative">
            <div class="overflow-hidden relative rounded-lg h-96 lg:h-full">
                <div>
                    <img class="block absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2"
                         src="<?php echo "../../../images/${ad['username']}/${images[0]}" ?>"
                         alt="<?php echo $images[0] ?>">
                </div>
            </div>
        </div>
    <?php } ?>
</div>

<?php if ($user && $user->username == $ad['username']) { ?>
    <a href="<?php echo getQuery('ad', 'edit', [['id', $ad['id']]]) ?>"
       class="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4
        focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-gray-600
        dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700
        dark:focus:ring-gray-800">
        Edit
    </a>
    <a href="<?php echo getQuery('ad', 'delete', [['id', $ad['id']]]) ?>"
       class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg
        text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        Delete
    </a>
<?php } ?>

<div class="mt-10">
    <h1 class="text-2xl text-white">Leave a comment</h1>
</div>

<div class="w-full bg-white p-5 pt-4 rounded shadow-lg mb-10 mt-5">
    <?php if ($user) { ?>
        <div class="flex ml-3">
            <div>
                <h1 class="font-semibold" id="username"><?php echo $user->username ?></h1>
                <p class="text-gray-500 text-sm" id="email"><?php echo $user->email ?></p>
            </div>
        </div>
    <?php } else { ?>
        <div class="grid xl:grid-cols-2 xl:gap-6">
            <div class="z-0 w-full group">
                <label for="username"
                       class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Username *
                </label>
                <input type="text" id="username" name="username" class="shadow-sm border border-gray-300
                text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                dark:placeholder-gray-400 dark:focus:ring-blue-500
                dark:focus:border-blue-500 dark:shadow-sm-light" required>
            </div>

            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email
                    *</label>
                <input type="email" id="email" name="email"
                       class="shadow-sm border border-gray-300 text-black text-sm rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                       dark:placeholder-gray-400 dark:focus:ring-blue-500
                       dark:focus:border-blue-500 dark:shadow-sm-light"
                       placeholder="name.surname@gmail.com" required>
            </div>
        </div>
    <?php } ?>
    <div class="mt-3 w-full">
        <label>
                <textarea rows="3"
                          id="comment-body"
                          class="border p-2 rounded w-full"
                          placeholder="Write something ..."
                          name="comment"
                ></textarea>
        </label>
    </div>

    <button type="submit" name="submit" id="comment-submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium
                    rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
                    dark:focus:ring-blue-800 mt-5">
        Submit
    </button>
</div>

<?php foreach ($comments as $comment) { ?>
    <div class="flex justify-between rounded border border-gray-600 mb-10 p-5">
        <div>
            <h1 class="font-semibold text-white text-2xl"><?php echo $comment->username ?></h1>
            <p class="text-white"><?php echo $comment->body ?></p>
            <p class="text-gray-500 mt-5"><?php echo $comment->country ?></p>
        </div>

        <?php if ($user && $user->username === $comment->username) { ?>
            <a href="<?php echo getQuery('comment', 'delete', [['id', $comment->id]]) ?>"
               class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg
        text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900
        self-center">
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
