<?php

use JetBrains\PhpStorm\ArrayShape;

function setJsonHeaders()
{
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json; charset=utf-8');
}

function json(array $data, int $code = 200): string
{
    http_response_code($code);
    return json_encode($data);
}

#[ArrayShape(['error' => 'bool', 'message' => 'string'])]
function getResponse(string $message, bool $error = false): array
{
    return ['error' => $error, 'message' => $message];
}

/**
 * @param string $url
 * @return stdClass|null
 */
function getRequest(string $url): ?stdClass
{
    $response = file_get_contents($url);
    if (!$response)
        return null;

    return json_decode($response);
}