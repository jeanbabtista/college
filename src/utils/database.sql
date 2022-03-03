CREATE DATABASE IF NOT EXISTS 'sp-vaja-1' DEFAULT CHARACTER SET utf8 COLLATE utf8_slovenian_ci;
USE 'sp-vaja-1';

DROP TABLE IF EXISTS ads;
CREATE TABLE IF NOT EXISTS ads (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `title` text COLLATE utf8_slovenian_ci NOT NULL,
     `description` text COLLATE utf8_slovenian_ci NOT NULL,
     `user_id` int(11) NOT NULL,
     `image` longblob NOT NULL,
     PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `username` text COLLATE utf8_slovenian_ci NOT NULL,
    `password` text COLLATE utf8_slovenian_ci NOT NULL,
    PRIMARY KEY (`id`)
);
