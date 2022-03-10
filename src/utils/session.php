<?php

function getUserFromSession(): ?stdClass {
    if (isset($_SESSION['USER_ID']))
        return $_SESSION['USER_ID'];
    return null;
}
