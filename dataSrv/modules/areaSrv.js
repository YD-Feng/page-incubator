var connPool = require('../connPool');

module.exports = {
    //获取区域列表
    getAreaList: function (callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * from area order by area_id desc';

            connection.query(SQL, function (err, listResult) {
                if (err) throw err;
                callback(listResult);
                connection.release();//释放链接
            });
        });
    },

    //保存区域信息
    saveArea: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (opts.area_id) {
                //传入ID，则编辑
                var arr = [],
                    SQL;

                arr.push('area_name = ' + connPool.escape(opts.area_name));
                arr.push('area_code = ' + connPool.escape(opts.area_code));
                arr.push('test_user = ' + connPool.escape(opts.test_user));
                arr.push('test_password = ' + connPool.escape(opts.test_password));

                SQL = 'update area set ' + arr.join(',') + ' where area_id = ' + connPool.escape(opts.area_id);

                connection.query(SQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });

            } else {
                //没传入ID，则新增
                var SQL = 'insert into area (area_name, area_code, test_user, test_password) ',
                    values = [
                        connPool.escape(opts.area_name),
                        connPool.escape(opts.area_code),
                        connPool.escape(opts.test_user),
                        connPool.escape(opts.test_password)
                    ];

                SQL += 'values(' + values.join(',') + ')';

                connection.query(SQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });
            }

        });
    },

    //删除区域
    delArea: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var delPageSQL = 'delete from activity_page where area_id = ' + connPool.escape(opts.area_id),
                delAreaSQL = 'delete from area where area_id = ' + connPool.escape(opts.area_id);

            //开启事务
            connection.beginTransaction(function (err) {
                if (err) throw err;

                connection.query(delPageSQL, function (err, result) {
                    if (err) throw err;

                    connection.query(delAreaSQL, function (err, result) {
                        if (err) throw err;

                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }
                            callback(result);
                            connection.release();//释放链接
                        });
                    });
                });
            });
        });
    }
};
