# page-incubator

活动页孵化器<br><br>

# 项目目录说明
### config/
项目配置，包括 api状态码 and 数据库连接 配置<br>
### dataSrv/
数据服务代码，对数据库进行直接操作<br>
### files/
文件目录，用于存放页面原型模版（以及页面引用的静态资源备份），还用于临时存放项目生成的H5活动页面文件<br>
### routes/
后端 api 路由，以及对应的业务逻辑方法<br>
### static/
项目的前端部分代码，目录内部完全可以视作是另一个项目，这里只是为了方便放到了同一个项目中<br>
### validate/
一个 express 中间件，用于 api 校验（参数合法校验，免登陆白名单）.里面的 validateConfig.js 负责配置 api 路由与校验规则的对应关系。里面的 modules 目录下则是各个 api模块 的具体校验规则<br>
### app.js
构建后端服务的主文件<br>
### start.js
 - 后端服务的启动脚本，node 可执行脚本<br>

<br><br>

# 项目说明
由于公司业务需要，不定期会有大量的H5活动页需求<br>
且每次的活动设计风格，布局等毫无规律可言<br>
并且每个活动页面还会随着城市的不同而不同（主要体现在活动商品的优惠力度上）<br>
公司的前端开发资源有限，而H5活动页的需求却是无限的<br>
由于H5活动页的两个天然特质：1.技术含量低，2.枯燥的体力劳动量大<br>
使得很多前端不愿意去做这一项工作，也间接的成为一个人才流失的诱因<br>
这个项目因此应运而生了...<br>
旨在让完全不懂技术的设计和运营经过简单的培训，也能通过系统做出H5活动页来<br>
并通过系统生成页面文件<br>
由于数据库表设计用的是下划线命名方式，而JS编写用的是驼峰命名方式，导致 JS 代码有点乱...<br>
mySQL 在建库建表时发现驼峰玩不起来，原因不明...<br>
只知道用驼峰的话，mySQL 会自动帮我转成全小写，请原谅我是一个数据库小白...<br>
JS的开发规范遵循已久，不愿放弃...<br>
特意把返回数据的下划线命名方式转驼峰又太浪费性能了...<br>
所以...请容忍下 JS 代码的那点混乱吧...这真不是我的初心呐...<br>

<br><br>

# 温馨提示
此项目虽然开源，但纯属个人为了满足公司业务而作<br>
有参考意义，但直接拿去用是不现实的，毕竟每个公司有着不同的业务需求<br>

<br><br>

# 数据库脚本
请见项目根目录下的 init.sql 文件<br>
```
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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='用户分组' AUTO_INCREMENT=6 ;

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='活动表' AUTO_INCREMENT=7 ;



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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='活动页面表' AUTO_INCREMENT=6 ;
```

<br><br>

# 部署步骤
1.搭建 mySQL 数据库<br>
2.修改项目根目录下 config/dataBase.js 里数据库相关配置<br>
3.执行数据库脚本<br>
4.进入项目的 static 目录，在该目录下执行 npm install 安装前端的依赖包<br>
5.进入项目的 static 目录，在该目录下执行 npm run build 编译项目的前端静态资源<br>
5.返回项目根目录，并执行 npm install 安装后端的依赖包<br>
6.在目根目录下执行 npm run start 启动项目的后端服务<br>
7.打开浏览器，访问 http://127.0.0.1:3000<br>
看到登录界面，说明部署完成<br>
