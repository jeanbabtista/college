<?php

require_once 'config/Database.php';
require_once 'utils/index.php';

$db = new Database();
$db = $db->getInstance();

setSession();
$user = getSessionUser();

require_once 'views/index.php';