<?php

/**
 * @throws Exception
 */
function createDirectory(string $path) {
    if (file_exists($path))
        return;

    $status = mkdir($path, 0777, true);

    if (!$status)
        throw new Exception('Error: could not create directory');
}

function deleteImage(string $path) {
    if (file_exists($path))
        unlink($path);
}