<?php

function getUserFromSession(): ?stdClass {
    if (isset($_SESSION['USER_ID']))
        return $_SESSION['USER_ID'];
    return null;
}

function setSession() {
    if (isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] < 1800)
        session_regenerate_id(true);
    $_SESSION['LAST_ACTIVITY'] = time();
}