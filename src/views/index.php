<?php
list('user' => $user) = get_defined_vars();

if (isset($_GET['controller']) && $_GET['controller'] == 'comment') {
    setJsonHeaders();

    $controller = $_GET['controller'];
    $action = $_GET['action'];

    require_once __DIR__ . '/../routes/index.php';
    return;
}
?>

<!DOCTYPE html>
<html lang="eng">
<head>
    <title>Local Ads</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <link rel="stylesheet" href="https://unpkg.com/flowbite@1.3.4/dist/flowbite.min.css"/>
</head>
<body class="bg-gray-900">
<nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800">
    <div class="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/src/" class="flex items-center">
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Local Ads</span>
        </a>

        <div class="flex md:order-2">
            <div class="hidden relative mr-3 md:mr-0 md:block">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1
                         1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd">
                        </path>
                    </svg>
                </div>

                <label for="search" class="hidden"></label>

                <input type="text" id="search" class="block p-2 pl-10 w-full text-gray-900 bg-gray-50
                    rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search...">
            </div>

            <button data-collapse-toggle="mobile-menu-3" type="button" class="inline-flex items-center p-2 ml-3 text-sm
                text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200
                dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="mobile-menu-3" aria-expanded="false">
                <span class="sr-only">Open main menu</span>

                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1
                    1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd">
                    </path>
                </svg>

                <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414
                    1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586
                    10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd">
                    </path>
                </svg>
            </button>
        </div>

        <div class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-3">
            <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <?php if ($user) { ?>
                    <li>
                        <a href="<?php echo getQuery('user', 'index', [['id', "$user->id"]]) ?>"
                           class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                            dark:text-gray-200 dark:hover:text-white">
                            My profile
                        </a>
                    </li>
                    <li>
                        <a href="<?php echo getQuery('ad', 'create') ?>"
                           class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                            dark:text-gray-200 dark:hover:text-white">
                            Publish ad
                        </a>
                    </li>
                    <?php if ($user->isAdmin) { ?>
                        <li>
                            <a href="<?php echo getQuery('user', 'index') ?>"
                               class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                            dark:text-gray-200 dark:hover:text-white">
                                Users
                            </a>
                        </li>
                    <?php } ?>
                    <li>
                        <a href="<?php echo getQuery('auth', 'logout') ?>"
                           class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                            dark:text-gray-200 dark:hover:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0
                                0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                                </path>
                            </svg>
                        </a>
                    </li>
                <?php } else { ?>
                    <li>
                        <a href="<?php echo getQuery('auth', 'login') ?>"
                           class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                        dark:text-gray-200 dark:hover:text-white">
                            Login
                        </a>
                    </li>
                    <li>
                        <a href="<?php echo getQuery('auth', 'register') ?>"
                           class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600
                            dark:text-gray-200 dark:hover:text-white">
                            Register
                        </a>
                    </li>
                <?php } ?>
            </ul>
        </div>
    </div>
</nav>

<main class="container mx-auto px-2 mt-5">

    <?php
    // set controller and action for server logic
    if (isset($_GET['controller']) && isset($_GET['action'])) {
        $controller = $_GET['controller'];
        $action = $_GET['action'];
    }

    // routing
    require_once __DIR__ . '/../routes/index.php'
    ?>

</main>

<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/flowbite@1.3.4/dist/flowbite.js"></script>
<script src="https://unpkg.com/flowbite@1.3.4/dist/datepicker.js"></script>
<script src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
<script src="/src/public/scripts/main.js"></script>
</body>
</html>
