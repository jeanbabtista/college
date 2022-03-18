# CREATE DATABASE IF NOT EXISTS 'sp-vaja-1' DEFAULT CHARACTER SET utf8 COLLATE utf8_slovenian_ci;
# USE 'sp-vaja-1';

DROP TABLE IF EXISTS ad_categories;
DROP TABLE IF EXISTS ad_images;
DROP TABLE IF EXISTS ad;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
    id int(11) NOT NULL AUTO_INCREMENT,
    username text NOT NULL,
    email text NOT NULL,
    fname text NOT NULL,
    lname text NOT NULL,
    password text NOT NULL,
    address text,
    post text,
    phone text,
    sex enum('m', 'f'),
    age int(11),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ad;
CREATE TABLE IF NOT EXISTS ad (
     id int(11) NOT NULL AUTO_INCREMENT,
     title text NOT NULL,
     description text NOT NULL,
     date_start timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
     date_end timestamp NOT NULL,
     views int(11) NOT NULL DEFAULT 0,
     user_id int(11) NOT NULL,
     front_image_id int(11) NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (user_id)
         REFERENCES user(id)
         ON DELETE CASCADE
         ON UPDATE CASCADE,
     FOREIGN KEY (front_image_id)
         REFERENCES image(id)
         ON DELETE CASCADE
         ON UPDATE CASCADE
);

DROP TABLE IF EXISTS image;
CREATE TABLE IF NOT EXISTS image (
    id int(11) NOT NULL AUTO_INCREMENT,
    path text NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS category;
CREATE TABLE IF NOT EXISTS category (
    id int(11) NOT NULL AUTO_INCREMENT,
    title text NOT NULL,
    parent_id int(11),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ad_categories;
CREATE TABLE IF NOT EXISTS ad_categories (
    id int(11) NOT NULL AUTO_INCREMENT,
    ad_id int(11) NOT NULL,
    category_id int(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ad_id)
        REFERENCES ad(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DROP TABLE IF EXISTS ad_images;
CREATE TABLE IF NOT EXISTS ad_images (
   id int(11) NOT NULL AUTO_INCREMENT,
   ad_id int(11) NOT NULL,
   image_id int(11) NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (ad_id)
        REFERENCES ad(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE,
   FOREIGN KEY (image_id)
       REFERENCES image(id)
       ON DELETE CASCADE
       ON UPDATE CASCADE
);

