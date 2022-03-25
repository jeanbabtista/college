<?php

/**
 * @param string $controller
 * @param string $action
 * @param array $args
 *  $args = [
 *      [ key: string, value: string ]
 *  ]
 * @return string
 */
function getQuery(string $controller, string $action, array $args = []): string
{
    $query = "?controller=$controller&action=$action";

    foreach ($args as list(0 => $key, 1 => $value))
        $query .= "&$key=$value";

    return $query;
}