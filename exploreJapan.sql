DROP database if exists `exploreJapan`;
CREATE database `exploreJapan`;
USE `exploreJapan`;

-- Create Tables --

CREATE TABLE `regions` (
	`regionId` int NOT NULL AUTO_INCREMENT,
	`nameJp` varchar(45) NOT NULL,
	`nameKana` varchar(45) NOT NULL,
	`nameEn` varchar(45) NOT NULL,
	PRIMARY KEY (`regionId`)
);

CREATE TABLE `tags` (
	`tagId` int NOT NULL AUTO_INCREMENT,
	`nameEn` varchar(45) NOT NULL,
	`nameJp` varchar(45),
	PRIMARY KEY (`tagId`)
);

CREATE TABLE `users` (
	`userId` int NOT NULL AUTO_INCREMENT,
	`username` varchar(20) NOT NULL UNIQUE,
	`password` varchar(50) NOT NULL,
	`email` varchar(50) NOT NULL,
	`isAdmin` int NOT NULL DEFAULT '0',
	`avaPath` varchar(100) NOT NULL,
	PRIMARY KEY (`userId`)
);

CREATE TABLE `prefectures` (
	`prefectureId` int NOT NULL AUTO_INCREMENT,
	`regionId` int NOT NULL,
	`nameJp` varchar(45) NOT NULL,
	`nameKana` varchar(45) NOT NULL,
	`nameEn` varchar(45) NOT NULL,
	PRIMARY KEY (`prefectureId`)
);

CREATE TABLE `articles` (
	`articleId` int NOT NULL AUTO_INCREMENT,
	`title` varchar(100) NOT NULL,
	`coverPath` varchar(100) NOT NULL,
	`content` TEXT,
	`createdDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`scopeDateStart` DATE NOT NULL,
	`scopeDateEnd` DATE,
	`isPhoto` int NOT NULL DEFAULT '0',
	`userId` int NOT NULL,
	`prefectureId` int NOT NULL,
	`tags` json NOT NULL,
	PRIMARY KEY (`articleId`)
);

CREATE TABLE `saved` (
	`userId` int NOT NULL,
	`articleId` int NOT NULL,
	PRIMARY KEY (`userId`,`articleId`)
);

CREATE TABLE `Comments` (
	`commentId` int NOT NULL AUTO_INCREMENT,
	`commentTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`commentText` TEXT NOT NULL,
	`userId` int NOT NULL,
	PRIMARY KEY (`commentId`)
);

CREATE TABLE `articles_comments` (
	`articleId` int NOT NULL,
	`commentId` int NOT NULL,
	PRIMARY KEY (`articleId`,`commentId`)
);

ALTER TABLE `prefectures` ADD CONSTRAINT `prefectures_fk0` FOREIGN KEY (`regionId`) REFERENCES `regions`(`regionId`);

ALTER TABLE `articles` ADD CONSTRAINT `articles_fk0` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`);

ALTER TABLE `articles` ADD CONSTRAINT `articles_fk1` FOREIGN KEY (`prefectureId`) REFERENCES `prefectures`(`prefectureId`);

ALTER TABLE `saved` ADD CONSTRAINT `saved_fk0` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`);

ALTER TABLE `saved` ADD CONSTRAINT `saved_fk1` FOREIGN KEY (`articleId`) REFERENCES `articles`(`articleId`);

ALTER TABLE `Comments` ADD CONSTRAINT `Comments_fk0` FOREIGN KEY (`userId`) REFERENCES `users`(`userId`);

ALTER TABLE `articles_comments` ADD CONSTRAINT `articles_comments_fk0` FOREIGN KEY (`articleId`) REFERENCES `articles`(`articleId`);

ALTER TABLE `articles_comments` ADD CONSTRAINT `articles_comments_fk1` FOREIGN KEY (`commentId`) REFERENCES `Comments`(`commentId`);




-- DATA --

INSERT INTO users VALUES
(1, 'admin01', '1234', 'admin01@gmail.com', 1, 'admin01.jpg'),
(2, 'user01', '1234', 'user01@gmail.com', 0, 'user01.jpg');

INSERT INTO regions VALUES
  (1,'北海道地方','ホッカイドウチホウ','hokkaido'),
  (2,'東北地方','トウホクチホウ','tohoku'),
  (3,'関東地方','カントウチホウ','kanto'),
  (4,'中部地方','チュウブチホウ','chubu'),
  (5,'近畿・関西地方','キンキ・カンサイチホウ','kinki・kansai'),
  (6,'中国地方','チュウゴクチホウ','chugoku'),
  (7,'四国地方','シコクチホウ','shikoku'),
  (8,'九州地方','キュウシュウチホウ','kyushu');
  
INSERT INTO prefectures VALUES
  (1,1,'北海道','ホッカイドウ','hokkaido'),
  (2,2,'青森県','アオモリケン','aomori'),
  (3,2,'岩手県','イワテケン','iwate'),
  (4,2,'宮城県','ミヤギケン','miyagi'),
  (5,2,'秋田県','アキタケン','akita'),
  (6,2,'山形県','ヤマガタケン','yamagata'),
  (7,2,'福島県','フクシマケン','fukushima'),
  (8,3,'茨城県','イバラキケン','ibaraki'),
  (9,3,'栃木県','トチギケン','tochigi'),
  (10,3,'群馬県','グンマケン','gunma'),
  (11,3,'埼玉県','サイタマケン','saitama'),
  (12,3,'千葉県','チバケン','chiba'),
  (13,3,'東京都','トウキョウト','tokyo'),
  (14,3,'神奈川県','カナガワケン','kanagawa'),
  (15,4,'新潟県','ニイガタケン','niigata'),
  (16,4,'富山県','トヤマケン','toyama'),
  (17,4,'石川県','イシカワケン','ishikawa'),
  (18,4,'福井県','フクイケン','fukui'),
  (19,4,'山梨県','ヤマナシケン','yamanashi'),
  (20,4,'長野県','ナガノケン','nagano'),
  (21,4,'岐阜県','ギフケン','gifu'),
  (22,4,'静岡県','シズオカケン','shizuoka'),
  (23,4,'愛知県','アイチケン','aichi'),
  (24,5,'三重県','ミエケン','mie'),
  (25,5,'滋賀県','シガケン','shiga'),
  (26,5,'京都府','キョウトフ','kyoto'),
  (27,5,'大阪府','オオサカフ','osaka'),
  (28,5,'兵庫県','ヒョウゴケン','hyogo'),
  (29,5,'奈良県','ナラケン','nara'),
  (30,5,'和歌山県','ワカヤマケン','wakayama'),
  (31,6,'鳥取県','トットリケン','tottori'),
  (32,6,'島根県','シマネケン','shimane'),
  (33,6,'岡山県','オカヤマケン','okayama'),
  (34,6,'広島県','ヒロシマケン','hiroshima'),
  (35,6,'山口県','ヤマグチケン','yamaguchi'),
  (36,7,'徳島県','トクシマケン','tokushima'),
  (37,7,'香川県','カガワケン','kagawa'),
  (38,7,'愛媛県','エヒメケン','ehime'),
  (39,7,'高知県','コウチケン','kochi'),
  (40,8,'福岡県','フクオカケン','fukuoka'),
  (41,8,'佐賀県','サガケン','saga'),
  (42,8,'長崎県','ナガサキケン','nagasaki'),
  (43,8,'熊本県','クマモトケン','kumamoto'),
  (44,8,'大分県','オオイタケン','oita'),
  (45,8,'宮崎県','ミヤザキケン','miyazaki'),
  (46,8,'鹿児島県','カゴシマケン','kagoshima'),
  (47,8,'沖縄県','オキナワケン','okinawa');

INSERT INTO articles VALUES
(1, 'ARTICLE TITLE', 'coverPathArticle.jpg', 'CONTENT ARTICLE', NOW(), "2017-06-15", "2017-12-15", 0, 1, 13, JSON_ARRAY('japan', 'tokyo', 'tower', 'red')),
(2, 'PHOTO TITLE', 'coverPathPhoto.jpg', NULL, NOW(), "2017-06-15", NULL, 1, 2, 13, JSON_ARRAY('japan', 'tokyo', 'landscape'));

INSERT INTO saved VALUES
(1, 1),
(2, 1),
(2, 2);