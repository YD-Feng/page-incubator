var dataBaseConfig = require('./../config/dataBase'),
    mysql = require('mysql'),

    //使用连接池的连接方式
    pool  = mysql.createPool(dataBaseConfig);

module.exports = pool;
