<?php
include_once './partials/header.php';
global $user;

?>

<h1>Hello, <?php echo $user ? $user->username : 'please log in'?>!</h1>

<?php include_once './partials/footer.php' ?>