var connPool = require('../connPool');

module.exports = {
    //用户信息核对
    check: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL =
                'select * from user where user_name=' +
                connPool.escape(opts.user_name) +
                ' and password=' +
                connPool.escape(opts.password);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //获取用户列表
    getUserList: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var flag = 0,
                str = '',
                countSQL = 'select count(*) from user',
                listSQL = 'select * from user';

            if (!!opts.user_name) {
                str = (flag == 0 ? ' where ' : ' and ') + 'name=' + connPool.escape(opts.user_name);
                countSQL += str;
                listSQL += str;
                flag++;
            }

            if (!!opts.createTimeStart && typeof !!opts.createTimeEnd) {
                str = (flag == 0 ? ' where ' : ' and ') + 'createTime between TIMESTAMP(' + connPool.escape(opts.createTimeStart + ' 00:00:00') + ') and TIMESTAMP(' + connPool.escape(opts.createTimeEnd + ' 23:59:59') + ')';
                countSQL += str;
                listSQL += str;
                flag++;
            } else if (!!opts.createTimeStart && !opts.createTimeEnd) {
                str = (flag == 0 ? ' where ' : ' and ') + 'createTime >= TIMESTAMP(' + connPool.escape(opts.createTimeStart + ' 00:00:00') + ')';
                countSQL += str;
                listSQL += str;
                flag++;
            } else if (!opts.createTimeStart && typeof !!opts.createTimeEnd) {
                str = (flag == 0 ? ' where ' : ' and ') + 'createTime <= TIMESTAMP(' + connPool.escape(opts.createTimeEnd + ' 23:59:59') + ')';
                countSQL += str;
                listSQL += str;
                flag++;
            }

            if (!opts.pageSize) {
                opts.pageSize = 30;
            }

            if (!opts.currentPage) {
                opts.currentPage = 1;
            }

            str = ' order by id limit ' + (opts.pageSize * (opts.currentPage - 1)) + ',' + opts.pageSize;

            listSQL += str;

            connection.query(countSQL, function (err, countResult) {
                if (err) throw err;

                connection.query(listSQL, function (err, listResult) {
                    if (err) throw err;
                    callback({
                        totalCount: countResult[0]['count(*)'],
                        currentPage: opts.currentPage,
                        pageSize: opts.pageSize,
                        list: listResult
                    });
                    connection.release();//释放链接
                });
            });
        });
    },

    //检测用户名是否存在
    checkUserName: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * from user where name=' + connPool.escape(opts.userName);

            if (typeof opts.id != 'undefined' && opts.id != '') {
                SQL += 'and id!=' + connPool.escape(opts.id);
            }

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //保存用户信息
    save: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (typeof opts.id != 'undefined' && opts.id != '') {
                //传入ID，则编辑
                var strArr = [];

                if (typeof opts.userName != 'undefined' && opts.userName != '') {
                    strArr.push('name=' + connPool.escape(opts.userName));
                }
                if (typeof opts.password != 'undefined' && opts.password != '') {
                    strArr.push('password=' + connPool.escape(opts.password));
                }

                connection.query('update user set ' + strArr.join(',') + ' where id = ' + connPool.escape(opts.id), function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });

            } else {
                //没传入ID，则新增
                var values = [
                    connPool.escape(opts.userName),
                    connPool.escape(opts.password)
                ];

                connection.query('insert into user (name,password) values(' + values.join(',') + ')', function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });
            }

        });
    },

    //获取用户分组列表
    getUserGroupList: function (callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * from user_group';

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },
};
