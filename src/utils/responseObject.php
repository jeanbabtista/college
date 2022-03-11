<?php

use JetBrains\PhpStorm\ArrayShape;

#[ArrayShape(['error' => "bool", 'message' => "string", 'data' => "\bool|mysqli_result"])]
function getResponse(bool $error, string $message, $data = null): array
{
    return [
        'error' => $error,
        'message' => $message,
        'data' => $data
    ];
}