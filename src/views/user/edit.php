<?php list('user' => $user) = get_defined_vars() ?>

<div class="flex justify-center">
    <div class="max-w-md w-full space-y-8">
        <div>
            <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                 alt="Workflow">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-200">
                Edit user <?php echo $user->username ?>
            </h2>
        </div>

        <form class="space-y-4" method="post"
              action="<?php echo getQuery('user', 'edit', [['id', "$user->id"]]) ?>">
            <div class="mb-4">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Username
                    *</label>
                <input type="text" id="username" name="username"
                       class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 +
                        dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 +
                        dark:focus:border-blue-500 dark:shadow-sm-light"
                       value="<?php echo $user->username ?>"
                       required>
            </div>

            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email
                    *</label>
                <input type="email" id="email" name="email"
                       class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                       dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                       dark:focus:border-blue-500 dark:shadow-sm-light"
                       value="<?php echo $user->email ?>"
                       placeholder="name.surname@gmail.com" required>
            </div>


            <div class="grid xl:grid-cols-2 xl:gap-6">
                <div class="z-0 w-full group">
                    <label for="fname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">First
                        name *</label>
                    <input type="text" id="fname" name="fname"
                           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                           dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500 dark:shadow-sm-light"
                           value="<?php echo $user->fname ?>"
                           required>
                </div>

                <div class="z-0 w-full group">
                    <label for="lname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Last name
                        *</label>
                    <input type="text" id="lname" name="lname"
                           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                           dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500 dark:shadow-sm-light"
                           value="<?php echo $user->lname ?>"
                           required>
                </div>
            </div>

            <div class="grid xl:grid-cols-2 xl:gap-6">
                <div class="z-0 w-full group">
                    <label for="address"
                           class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Address</label>
                    <input type="text" id="address" name="address"
                           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                           dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500 dark:shadow-sm-light"
                           value="<?php echo $user->address ?>"
                           placeholder="Cool street, 1234">
                </div>

                <div class="z-0 w-full group">
                    <label for="phone"
                           class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Phone</label>
                    <input type="text" id="phone" name="phone"
                           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                           dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500 dark:shadow-sm-light"
                           value="<?php echo $user->phone ?>"
                           placeholder="123 456 789">
                </div>
            </div>

            <div class="grid xl:grid-cols-3 xl:gap-6">
                <div class="z-0 w-full group">
                    <label for="post"
                           class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Post</label>
                    <input type="text" id="post" name="post"
                           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                           dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500 dark:shadow-sm-light"
                           value="<?php echo $user->post ?>"
                           placeholder="5678">
                </div>

                <div class="z-0 w-full group">
                    <label for="sex" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Sex</label>
                    <select id="sex" name="sex"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                            dark:focus:border-blue-500">
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                    </select>
                </div>

                <div class="z-0 w-full group">
                    <label for="age" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Age</label>
                    <input type="number" id="age" name="age"
                           class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                           focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
                           dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                           dark:focus:border-blue-500 dark:shadow-sm-light"
                           value="<?php echo $user->age ?>">
                </div>
            </div>

            <button type="submit" name="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium
                    rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700
                    dark:focus:ring-blue-800">
                Submit
            </button>
        </form>
    </div>
</div>