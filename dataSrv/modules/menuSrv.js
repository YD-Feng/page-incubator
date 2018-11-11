var connPool = require('../connPool'),
    menuSrv = {
        //获取菜单列表
        getMenuList: function (callback) {
            connPool.getConnection(function (err, connection) {
                connection.query('select * from menu where status = 1', function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });
            });
        },

        //保存菜单信息
        save: function (opts, callback) {
            connPool.getConnection(function (err, connection) {

                if (typeof opts.id != 'undefined' && opts.id != '') {
                    //传入ID，则编辑
                    var strArr = [];

                    strArr.push('name=' + connPool.escape(opts.name));
                    strArr.push('href=' + connPool.escape(opts.href));

                    connection.query('update menu set ' + strArr.join(',') + ' where id = ' + connPool.escape(opts.id), function (err, result) {
                        if (err) throw err;
                        callback(result);
                        connection.release();//释放链接
                    });

                } else {
                    //没传入ID，则新增
                    var values = [connPool.escape(opts.name), connPool.escape(opts.href), connPool.escape(opts.pid)];

                    connection.query('insert into menu (name,href,parentId) values(' + values.join(',') + ')', function (err, result) {
                        if (err) throw err;
                        callback(result);
                        connection.release();//释放链接
                    });

                }

            });
        },

        //删除菜单
        delete: function (ids, callback) {
            connPool.getConnection(function (err, connection) {
                var SQL_A = 'select id from menu where id in (' + ids + ') or parentId in (' + ids + ')',
                    SQL_B = 'delete from menu where id in (' + ids + ') or parentId in (' + ids + ')';

                connection.query(SQL_A, function (err, s_result) {
                    if (err) throw err;

                    var idArr = [];

                    for (var i = 0, len = s_result.length; i < len; i++) {
                        idArr.push(s_result[i].id);
                    }

                    connection.query('delete from menu where parentId in (' + idArr.join(',') + ')', function (err, d_result_A) {
                        if (err) throw err;

                        connection.query(SQL_B, function (err, d_result_B) {
                            if (err) throw err;
                            d_result_B.affectedRows += d_result_A.affectedRows;
                            callback(d_result_B);
                            connection.release();//释放链接
                        });

                    });
                });
            });
        }
    };

module.exports = menuSrv;
