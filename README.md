# page-incubator

活动页孵化器<br><br>

# 项目进度
开发中...<br>
在项目开发完之前，数据库脚本和开发步骤请忽略<br>

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
待开发完成后补贴出来...<br>

<br><br>

# 部署步骤
1.搭建 mySQL 数据库<br>
2.修改项目根目录下 config/dataBase.js 里数据库相关配置<br>
3.执行数据库脚本<br>
4.进入项目的 static 目录，在该目录下执行 gulp build<br>
5.在项目根目录下执行 npm run start<br>
6.打开浏览器，访问 http://127.0.0.1:3000<br>
看到登录界面，说明部署完成<br>
