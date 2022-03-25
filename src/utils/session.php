<?php

function setSession()
{
    session_start();

    if (isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] < 1800)
        session_regenerate_id(true);
    $_SESSION['LAST_ACTIVITY'] = time();
}

function getSessionUser(): ?stdClass
{
    return $_SESSION['USER_ID'] ?? null;
}

function setSessionUser(stdClass $user)
{
    $_SESSION['USER_ID'] = $user;
}