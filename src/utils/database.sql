CREATE DATABASE IF NOT EXISTS `sp-vaja-2` DEFAULT CHARACTER SET utf8 COLLATE utf8_slovenian_ci;
USE `sp-vaja-2`;

CREATE TABLE IF NOT EXISTS user
(
    id       int(11) NOT NULL AUTO_INCREMENT,
    username text    NOT NULL,
    email    text    NOT NULL,
    fname    text    NOT NULL,
    lname    text    NOT NULL,
    password text    NOT NULL,
    address  text,
    post     text,
    phone    text,
    sex      enum ('m', 'f'),
    age      int(11),
    isAdmin  bool DEFAULT false,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ad
(
    id             int(11)   NOT NULL AUTO_INCREMENT,
    title          text      NOT NULL,
    description    text      NOT NULL,
    date_start     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_end       timestamp NOT NULL,
    views          int(11)   NOT NULL DEFAULT 0,
    user_id        int(11)   NOT NULL,
    front_image_id int(11)   NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (front_image_id)
        REFERENCES image (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS image
(
    id   int(11) NOT NULL AUTO_INCREMENT,
    path text    NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS category
(
    id    int(11) NOT NULL AUTO_INCREMENT,
    title text    NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO category (title)
VALUES ('beauty'),
       ('gaming'),
       ('make up');

CREATE TABLE IF NOT EXISTS ad_categories
(
    id          int(11) NOT NULL AUTO_INCREMENT,
    ad_id       int(11) NOT NULL,
    category_id int(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ad_id)
        REFERENCES ad (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES category (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ad_images
(
    id       int(11) NOT NULL AUTO_INCREMENT,
    ad_id    int(11) NOT NULL,
    image_id int(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ad_id)
        REFERENCES ad (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (image_id)
        REFERENCES image (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS comment
(
    id       int(11)   NOT NULL AUTO_INCREMENT,
    ad_id    int(11)   NULL,
    email    text      NOT NULL,
    username text      NOT NULL,
    body     text      NOT NULL,
    date     timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip       text,
    PRIMARY KEY (id),
    FOREIGN KEY (ad_id)
        REFERENCES ad (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)