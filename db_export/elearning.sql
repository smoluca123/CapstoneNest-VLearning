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

 Date: 09/04/2024 18:40:33
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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'test1@gmail.com', 'test1', '$2b$10$4UP5n9oemGAUu07EOGfomutgAF5hnTCj4TSZNvF0XOiGnLvCSmELW', 'Test 1', '0000000000', 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImtleSI6MTcxMjY2Mjc0NjIwOCwiaWF0IjoxNzEyNjYyNzQ2LCJleHAiOjE3MTUyNTQ3NDZ9.Pyp69DluPx_7Ku3STz1ADo1DslDJ_OHdeCJaz25xBBY', 0, 0);
INSERT INTO `user` VALUES (7, 'dev1@gmail.com', 'dev1', '$2b$10$KUe8Sv9bOK5n.P.85wBueu9aQb0j5cvmD7yvXRBK5/HJzBON0YJ0q', 'Dev 1', '0909090909', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJkZXYxIiwia2V5IjoxNzEyMjU0NjI3OTg0LCJpYXQiOjE3MTIyNTQ2MjcsImV4cCI6MTcxNDg0NjYyN30.PgqbyOmje03_MCQCeVtDHruQqKKhLg_11wRHVuDUE0c', 1, 0);
INSERT INTO `user` VALUES (8, 'test2@gmail.com', 'test2', '$2b$10$13YW8DtIqsdv4oq4C6XLoentGEX0N6yt0PdgyNohSpzoV18K14PGa', 'Test 2', '0909090909', 1, NULL, 1, 1);

SET FOREIGN_KEY_CHECKS = 1;
