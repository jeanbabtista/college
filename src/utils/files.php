<?php

/**
 * @param string $path -> directory path
 * @return void
 */
function createDirectory(string $path)
{
    if (file_exists($path))
        return;

    mkdir($path, 0777, true);
}

/**
 * @param string $path -> image path
 * @return void
 */
function deleteImage(string $path)
{
    if (file_exists($path))
        unlink($path);
}