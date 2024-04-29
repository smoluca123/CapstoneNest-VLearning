/*
 Navicat Premium Data Transfer

 Source Server         : capstone-nestjs
 Source Server Type    : MySQL
 Source Server Version : 50739 (5.7.39-log)
 Source Host           : sg-capstone-nestjs-62054.servers.mongodirector.com:3306
 Source Schema         : elearning

 Target Server Type    : MySQL
 Target Server Version : 50739 (5.7.39-log)
 File Encoding         : 65001

 Date: 24/04/2024 15:14:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auth_code
-- ----------------------------
DROP TABLE IF EXISTS `auth_code`;
CREATE TABLE `auth_code`  (
  `code_id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`code_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_code
-- ----------------------------
INSERT INTO `auth_code` VALUES (1, 'SMOTeam');

-- ----------------------------
-- Table structure for category_course
-- ----------------------------
DROP TABLE IF EXISTS `category_course`;
CREATE TABLE `category_course`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `hidden` int(11) NOT NULL DEFAULT 0 COMMENT '0: Show, 1: Hidden',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of category_course
-- ----------------------------
INSERT INTO `category_course` VALUES (1, 'Lập trình Backend', 0);
INSERT INTO `category_course` VALUES (2, 'Thiết kế Web', 0);
INSERT INTO `category_course` VALUES (3, 'Lập trình Front end', 0);
INSERT INTO `category_course` VALUES (4, 'Lập trình Full Stack', 0);
INSERT INTO `category_course` VALUES (5, 'Lập trình di động', 0);
INSERT INTO `category_course` VALUES (6, 'Tư duy lập trình', 1);

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aliases` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `course_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `category` int(11) NOT NULL,
  `create_at` date NULL DEFAULT NULL,
  `course_img` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `students` int(11) NOT NULL DEFAULT 0,
  `hidden` int(11) NOT NULL DEFAULT 0 COMMENT '0: Show, 1: Hidden',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `course_category_course`(`category`) USING BTREE,
  CONSTRAINT `course_category_course` FOREIGN KEY (`category`) REFERENCES `category_course` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES (1, 'lap-trinh-nodejs', 'Lập trình NodeJS', 'Node.js là môi trường thời gian chạy JavaScript back-end, đa nền tảng, mã nguồn mở, chạy trên công cụ V8 và thực thi mã JavaScript bên ngoài trang web...', 1, '2024-04-14', 'https://elearningnew.cybersoft.edu.vn/hinhanh/lap-trinh-nodejs.png', 100, 4, 0);
INSERT INTO `course` VALUES (2, 'lap-trinh-nodejs2', 'Lập trình NodeJS2', 'Node.js là môi trường thời gian chạy JavaScript back-end, đa nền tảng, mã nguồn mở, chạy trên công cụ V8 và thực thi mã JavaScript bên ngoài trang web...', 1, '2024-04-14', 'https://elearningnew.cybersoft.edu.vn/hinhanh/lap-trinh-nodejs.png', 100, 1, 0);

-- ----------------------------
-- Table structure for enroll_course
-- ----------------------------
DROP TABLE IF EXISTS `enroll_course`;
CREATE TABLE `enroll_course`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `status` int(11) NOT NULL COMMENT '0 : Not approved yet, 1: Approved',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `enroll_course_user_id`(`user_id`) USING BTREE,
  INDEX `enroll_course_course_id`(`course_id`) USING BTREE,
  CONSTRAINT `enroll_course_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `enroll_course_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enroll_course
-- ----------------------------
INSERT INTO `enroll_course` VALUES (13, 11, 1, 1);
INSERT INTO `enroll_course` VALUES (14, 7, 1, 1);
INSERT INTO `enroll_course` VALUES (15, 8, 1, 1);
INSERT INTO `enroll_course` VALUES (16, 7, 2, 1);
INSERT INTO `enroll_course` VALUES (17, 1, 1, 1);

-- ----------------------------
-- Table structure for type_user
-- ----------------------------
DROP TABLE IF EXISTS `type_user`;
CREATE TABLE `type_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of type_user
-- ----------------------------
INSERT INTO `type_user` VALUES (1, 'User', 0);
INSERT INTO `type_user` VALUES (2, 'Lecturers', 1);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `full_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT 1,
  `refresh_token` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `status` smallint(6) NOT NULL DEFAULT 1 COMMENT '0 : banned, 1 : active',
  `hidden` smallint(6) NOT NULL DEFAULT 0 COMMENT '0 : show, : 1 hidden',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_type_user`(`type`) USING BTREE,
  CONSTRAINT `user_type_user` FOREIGN KEY (`type`) REFERENCES `type_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'test1@gmail.com', 'test1', '$2b$10$4UP5n9oemGAUu07EOGfomutgAF5hnTCj4TSZNvF0XOiGnLvCSmELW', 'Test 1', '0000000000', 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImtleSI6MTcxMzk0NDA1NzQ3NywiaWF0IjoxNzEzOTQ0MDU3LCJleHAiOjE3MTY1MzYwNTd9.MT8p81ELmyOUD8JO01Jq6OY40t3C51apI94Pj9HlBhQ', 1, 0);
INSERT INTO `user` VALUES (7, 'dev1@gmail.com', 'dev1', '$2b$10$KUe8Sv9bOK5n.P.85wBueu9aQb0j5cvmD7yvXRBK5/HJzBON0YJ0q', 'Dev 1', '0909090909', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJkZXYxIiwia2V5IjoxNzEyNzQ2NzM0MzczLCJpYXQiOjE3MTI3NDY3MzQsImV4cCI6MTcxNTMzODczNH0.lDGnJ9IkddkvBUCGDiy4hNRC7Tdm3fdQFC6vILUApLU', 1, 0);
INSERT INTO `user` VALUES (8, 'test2@gmail.com', 'test2', '$2b$10$13YW8DtIqsdv4oq4C6XLoentGEX0N6yt0PdgyNohSpzoV18K14PGa', 'Test 2', '0909090909', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJ0ZXN0MiIsImtleSI6MTcxMzI1NDczOTc4OCwiaWF0IjoxNzEzMjU0NzM5LCJleHAiOjE3MTU4NDY3Mzl9.YnNe6uD5jOv9Y1WwaaNzFSYZC-1TtU3HvdiZMnjY7YE', 1, 0);
INSERT INTO `user` VALUES (11, 'abc@gmail.com', 'abc', '$2b$10$5q6bikHHxwFDVm.PksAskuRf3ow9iV1Pp8F4o0MobGaxXAx9i7g2C', 'Abc', '000', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInVzZXJuYW1lIjoiYWJjIiwia2V5IjoxNzEzMjU0NzM5Nzg4LCJpYXQiOjE3MTMyNTQ3MzksImV4cCI6MTcxNTg0NjczOX0.iKZH1pJem90wUljpErMZXCFtDzcpP6IOYnYdtr3KLcA', 1, 0);

SET FOREIGN_KEY_CHECKS = 1;
