--
-- 数据库: `page_incubator`
--
CREATE DATABASE `page_incubator`;
use page_incubator;



--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_name` varchar(20) NOT NULL COMMENT '用户名',
  `password` varchar(150) NOT NULL COMMENT '密码',
  `group_id` int(11) NOT NULL COMMENT '所属分组',
  `nick_name` varchar(20) NOT NULL COMMENT '用户昵称',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `user` 默认添加一个超管帐号，用户名：admin，密码：admin
--

INSERT INTO `user` (`user_name`, `password`, `group_id`, `nick_name`) VALUES
('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 1, 'Admin');



--
-- 表的结构 `user_group`
--

CREATE TABLE IF NOT EXISTS `user_group` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(30) NOT NULL COMMENT '用户分组名',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='用户分组' AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `user_group`
--

INSERT INTO `user_group` (`group_name`) VALUES
('超级管理员'),
('运营-策划'),
('运营-设计');



--
-- 表的结构 `area`
--

CREATE TABLE IF NOT EXISTS `area` (
  `area_id` int(11) NOT NULL AUTO_INCREMENT,
  `area_name` varchar(20) NOT NULL COMMENT '区域名称',
  `area_code` varchar(10) NOT NULL COMMENT '区域编码',
  `test_user` varchar(30) NOT NULL COMMENT '测试账号',
  `test_password` varchar(30) NOT NULL COMMENT '测试账号密码',
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- 转存表中的数据 `area`
--

INSERT INTO `area` (`area_name`, `area_code`, `test_user`, `test_password`) VALUES
('佛山', 'FS', '13927279546', '943644'),
('汕头', 'ST', '18138756538', '123456'),
('顺德', 'SD', '13560010445 ', '123456'),
('湛江', 'ZJ', '13650926944', '123456'),
('珠海', 'ZH', '13112263404', '123456'),
('东莞', 'DG', '18903017013', '123456'),
('花都', 'HD', '13268134578', '123456'),
('江门', 'JM', '13760855994', '123456'),
('厦门', 'XM', '15992306003', '123456'),
('泉州', 'QZ', '18138753008', '123456'),
('长沙', 'CS', '13787079024', '123456'),
('福州', 'FZ', '18124081690', '123456'),
('惠州', 'HZ', '15819011147', 'zskx123456'),
('清远', 'QY', '13418079133', '123456');



--
-- 表的结构 `activity`
--

CREATE TABLE IF NOT EXISTS `activity` (
  `activity_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_name` varchar(30) NOT NULL COMMENT '活动名称',
  `create_name` varchar(30) NOT NULL COMMENT '创建人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `activity_desc` varchar(100) DEFAULT NULL COMMENT '活动描述',
  `folder` varchar(30) NOT NULL COMMENT '活动页面目录',
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='活动表' AUTO_INCREMENT=1 ;



--
-- 表的结构 `activity_page`
--

CREATE TABLE IF NOT EXISTS `activity_page` (
  `page_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) NOT NULL COMMENT '所属活动的id',
  `area_id` int(11) NOT NULL COMMENT '所属区域',
  `setting` text NOT NULL COMMENT '页面设置',
  `create_name` varchar(30) NOT NULL COMMENT '创建人',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `last_update_name` varchar(30) NOT NULL COMMENT '最后维护人',
  `last_update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '最后维护时间',
  PRIMARY KEY (`page_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='活动页面表' AUTO_INCREMENT=1 ;
