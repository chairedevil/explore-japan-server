DROP database if exists `exploreJapan`;
CREATE database `exploreJapan`;
USE `exploreJapan`;

-- Create Tables --

CREATE TABLE `regions` (
	`regionId` INT NOT NULL AUTO_INCREMENT,
	`nameJp` varchar(45) NOT NULL,
	`nameKana` varchar(45) NOT NULL,
	`nameEn` varchar(45) NOT NULL,
	PRIMARY KEY (`regionId`)
);

CREATE TABLE `tags` (
	`tagId` INT NOT NULL AUTO_INCREMENT,
	`nameEn` varchar(45) NOT NULL,
	`nameJp` varchar(45),
	PRIMARY KEY (`tagId`)
);

CREATE TABLE `users` (
	`userId` INT NOT NULL AUTO_INCREMENT,
	`username` varchar(20) NOT NULL UNIQUE,
	`password` varchar(50) NOT NULL,
	`email` varchar(50) NOT NULL,
	`isAdmin` INT NOT NULL DEFAULT '0',
	`avaPath` varchar(100) NOT NULL,
	PRIMARY KEY (`userId`)
);

CREATE TABLE `prefectures` (
	`prefectureId` INT NOT NULL AUTO_INCREMENT,
	`regionId` INT NOT NULL,
	`name` varchar(45) NOT NULL,
	`nameKana` varchar(45) NOT NULL,
	`nameEn` varchar(45) NOT NULL,
	PRIMARY KEY (`prefectureId`)
);

CREATE TABLE `articles` (
	`articleId` INT NOT NULL AUTO_INCREMENT,
	`title` varchar(100) NOT NULL,
	`coverPath` varchar(100) NOT NULL,
	`content` TEXT,
	`createdDateTime` DATETIME NOT NULL,
	`scopeDateStart` DATE NOT NULL,
	`scopeDateEnd` DATE,
	`isPhoto` INT NOT NULL DEFAULT '0',
	`userId` INT NOT NULL,
	`prefectureId` INT NOT NULL,
	PRIMARY KEY (`articleId`)
);

CREATE TABLE `tagArticle` (
	`tagId` INT NOT NULL,
	`articleId` INT NOT NULL,
	PRIMARY KEY (`tagId`,`articleId`)
);

CREATE TABLE `saved` (
	`userId` INT NOT NULL,
	`articleId` INT NOT NULL,
	PRIMARY KEY (`userId`,`articleId`)
);

ALTER TABLE `prefectures` ADD CONSTRAINT `prefectures_fk0` FOREIGN KEY (`regionId`) REFERENCES `regions`(`regionId`);

ALTER TABLE `articles` ADD CONSTRAINT `articles_fk0` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`);

ALTER TABLE `articles` ADD CONSTRAINT `articles_fk1` FOREIGN KEY (`prefectureId`) REFERENCES `prefectures`(`prefectureId`);

ALTER TABLE `tagArticle` ADD CONSTRAINT `tagArticle_fk0` FOREIGN KEY (`tagId`) REFERENCES `tags`(`tagId`);

ALTER TABLE `tagArticle` ADD CONSTRAINT `tagArticle_fk1` FOREIGN KEY (`articleId`) REFERENCES `articles`(`articleId`);

ALTER TABLE `saved` ADD CONSTRAINT `saved_fk0` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`);

ALTER TABLE `saved` ADD CONSTRAINT `saved_fk1` FOREIGN KEY (`articleId`) REFERENCES `articles`(`articleId`);




-- DATA --

INSERT INTO users VALUES
(1, 'admin01', '1234', 'admin01@gmail.com', 1, 'admin01.jpg'),
(2, 'user01', '1234', 'user01@gmail.com', 0, 'user01.jpg');

INSERT INTO regions VALUES
  (1,'北海道地方','ホッカイドウチホウ','HOKKAIDO'),
  (2,'東北地方','トウホクチホウ','TOHOKU'),
  (3,'関東地方','カントウチホウ','KANTO'),
  (4,'中部地方','チュウブチホウ','CHUBU'),
  (5,'近畿・関西地方','キンキ・カンサイチホウ','KINKI・KANSAI'),
  (6,'中国地方','チュウゴクチホウ','CHUGOKU'),
  (7,'四国地方','シコクチホウ','SHIKOKU'),
  (8,'九州地方','キュウシュウチホウ','KYUSHU');
  
INSERT INTO prefectures VALUES
  (1,1,'北海道','ホッカイドウ','HOKKAIDO'),
  (2,2,'青森県','アオモリケン','AOMORI'),
  (3,2,'岩手県','イワテケン','IWATE'),
  (4,2,'宮城県','ミヤギケン','MIYAGI'),
  (5,2,'秋田県','アキタケン','AKITA'),
  (6,2,'山形県','ヤマガタケン','YAMAGATA'),
  (7,2,'福島県','フクシマケン','FUKUSHIMA'),
  (8,3,'茨城県','イバラキケン','IBARAKI'),
  (9,3,'栃木県','トチギケン','TOCHIGI'),
  (10,3,'群馬県','グンマケン','GUNMA'),
  (11,3,'埼玉県','サイタマケン','SAITAMA'),
  (12,3,'千葉県','チバケン','CHIBA'),
  (13,3,'東京都','トウキョウト','TOKYO'),
  (14,3,'神奈川県','カナガワケン','KANAGAWA'),
  (15,4,'新潟県','ニイガタケン','NIIGATA'),
  (16,4,'富山県','トヤマケン','TOYAMA'),
  (17,4,'石川県','イシカワケン','ISHIKAWA'),
  (18,4,'福井県','フクイケン','FUKUI'),
  (19,4,'山梨県','ヤマナシケン','YAMANASHI'),
  (20,4,'長野県','ナガノケン','NAGANO'),
  (21,4,'岐阜県','ギフケン','GIFU'),
  (22,4,'静岡県','シズオカケン','SHIZUOKA'),
  (23,4,'愛知県','アイチケン','AICHI'),
  (24,5,'三重県','ミエケン','MIE'),
  (25,5,'滋賀県','シガケン','SHIGA'),
  (26,5,'京都府','キョウトフ','KYOTO'),
  (27,5,'大阪府','オオサカフ','OSAKA'),
  (28,5,'兵庫県','ヒョウゴケン','HYOGO'),
  (29,5,'奈良県','ナラケン','NARA'),
  (30,5,'和歌山県','ワカヤマケン','WAKAYAMA'),
  (31,6,'鳥取県','トットリケン','TOTTORI'),
  (32,6,'島根県','シマネケン','SHIMANE'),
  (33,6,'岡山県','オカヤマケン','OKAYAMA'),
  (34,6,'広島県','ヒロシマケン','HIROSHIMA'),
  (35,6,'山口県','ヤマグチケン','YAMAGUCHI'),
  (36,7,'徳島県','トクシマケン','TOKUSHIMA'),
  (37,7,'香川県','カガワケン','KAGAWA'),
  (38,7,'愛媛県','エヒメケン','EHIME'),
  (39,7,'高知県','コウチケン','KOCHI'),
  (40,8,'福岡県','フクオカケン','FUKUOKA'),
  (41,8,'佐賀県','サガケン','SAGA'),
  (42,8,'長崎県','ナガサキケン','NAGASAKI'),
  (43,8,'熊本県','クマモトケン','KUMAMOTO'),
  (44,8,'大分県','オオイタケン','OITA'),
  (45,8,'宮崎県','ミヤザキケン','MIYAZAKI'),
  (46,8,'鹿児島県','カゴシマケン','KAGOSHIMA'),
  (47,8,'沖縄県','オキナワケン','OKINAWA');

INSERT INTO articles VALUES
(1, 'ARTICLE TITLE', 'coverPathArticle.jpg', 'CONTENT ARTICLE', NOW(), "2017-06-15", "2017-12-15", 0, 1, 13),
(2, 'PHOTO TITLE', 'coverPathPhoto.jpg', NULL, NOW(), "2017-06-15", NULL, 1, 2, 13);

INSERT INTO tagArticle VALUES
(16466, 1),
(13844, 1),
(56860, 1),
(16466, 2),
(13844, 2),
(56860, 2);

INSERT INTO saved VALUES
(1, 1),
(2, 1),
(2, 2);