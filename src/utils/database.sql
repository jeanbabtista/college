# CREATE DATABASE IF NOT EXISTS 'sp-vaja-1' DEFAULT CHARACTER SET utf8 COLLATE utf8_slovenian_ci;
# USE 'sp-vaja-1';

DROP TABLE IF EXISTS ad;
CREATE TABLE IF NOT EXISTS ad (
     id int(11) NOT NULL AUTO_INCREMENT,
     title text NOT NULL,
     description text NOT NULL,
     user_id int(11) NOT NULL,
     image text NOT NULL,
     PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
    id int(11) NOT NULL AUTO_INCREMENT,
    username text NOT NULL,
    password text NOT NULL,
    PRIMARY KEY (id)
);


