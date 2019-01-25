var connPool = require('../connPool');

module.exports = {
    //用户信息核对
    check: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL =
                'select user_id, user_name, group_id, nick_name from user where user_name=' +
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
                arr = [''],
                countSQL = 'select count(*) from user',
                listSQL = 'select user.user_id, user.user_name, user.group_id, user.nick_name, user.create_time, user_group.group_name,' +
                    ' date_format(user.create_time, "%Y-%m-%d %T") as create_time' +
                    ' from user' +
                    ' inner join user_group on user.group_id = user_group.group_id';

            if (!!opts.user_name) {
                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'user_name like "%' + opts.user_name + '%"'
                );
                flag++;
            }

            if (!!opts.nick_name) {
                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'user_name like "%' + opts.nick_name + '%"'
                );
                flag++;
            }

            if (!!opts.group_id) {
                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'group_id=' + connPool.escape(opts.group_id)
                );
                flag++;
            }

            if (!!opts.start_time && !!opts.end_time) {

                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'create_time between TIMESTAMP(' + connPool.escape(opts.start_time) +
                    ') and TIMESTAMP(' + connPool.escape(opts.end_time) + ')'
                );

            } else if (!!opts.start_time && !opts.end_time) {

                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'create_time >= TIMESTAMP(' + connPool.escape(opts.start_time) + ')'
                );

            } else if (!opts.start_time && !!opts.end_time) {

                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'create_time <= TIMESTAMP(' + connPool.escape(opts.end_time) + ')'
                );

            }

            countSQL += arr.join(' ');
            listSQL += arr.join(' ');

            if (!opts.pageSize) {
                opts.pageSize = 10;
            }

            if (!opts.page) {
                opts.page = 1;
            }

            listSQL +=
                ' order by create_time desc limit ' +
                (opts.page_size * (opts.page - 1)) +
                ',' +
                opts.page_size;

            connection.query(countSQL, function (err, countResult) {
                if (err) throw err;

                connection.query(listSQL, function (err, listResult) {
                    if (err) throw err;
                    callback({
                        total: countResult[0]['count(*)'],
                        page: opts.page * 1,
                        pageSize: opts.pageSize * 1,
                        list: listResult
                    });
                    connection.release();//释放链接
                });
            });
        });
    },

    //获取用户信息
    getUserInfo: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select user_id, user_name, group_id, nick_name from user where user_id = ' + connPool.escape(opts.user_id);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //修改密码
    changePassword: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var searchSQL =
                'select * from user where user_id=' +
                connPool.escape(opts.user_id) +
                ' and password=' +
                connPool.escape(opts.old_password);

            connection.query(searchSQL, function (err, result) {
                if (err) throw err;

                if (result.length > 0) {

                    var changePwdSQL = 'update user set password=' + connPool.escape(opts.new_password) + ' where user_id = ' + connPool.escape(opts.user_id);
                    connection.query(changePwdSQL, function (err, result) {
                        if (err) throw err;
                        callback(result);
                        connection.release();//释放链接
                    });

                } else {
                    callback({
                        affectedRows: 0,
                        message: '旧密码输入有误'
                    });
                }
            });
        });
    },

    //检测用户名是否存在
    checkUserName: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select user_id, user_name, group_id, nick_name from user where user_name=' + connPool.escape(opts.user_name);

            if (typeof opts.user_id != 'undefined' && opts.user_id != '') {
                SQL += 'and user_id!=' + connPool.escape(opts.user_id);
            }

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //保存用户信息
    saveUser: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (opts.user_id) {
                //传入ID，则编辑
                var strArr = [],
                    SQL = '';

                //校验中间件不校验的非必传字段
                if (typeof opts.user_name != 'undefined' && opts.user_name != '') {
                    strArr.push('user_name=' + connPool.escape(opts.user_name));
                }

                if (typeof opts.password != 'undefined' && opts.password != '') {
                    strArr.push('password=' + connPool.escape(opts.password));
                }

                if (typeof opts.group_id != 'undefined' && opts.group_id != '') {
                    strArr.push('group_id=' + connPool.escape(opts.group_id));
                }

                if (typeof opts.nick_name != 'undefined' && opts.nick_name != '') {
                    strArr.push('nick_name=' + connPool.escape(opts.nick_name));
                }

                SQL = 'update user set ' + strArr.join(',') + ' where user_id = ' + connPool.escape(opts.user_id);

                connection.query(SQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });

            } else {
                //没传入ID，则新增
                var SQL = 'insert into user (user_name, password, group_id, nick_name) ',
                    values = [
                        connPool.escape(opts.user_name),
                        connPool.escape(opts.password),
                        connPool.escape(opts.group_id),
                        connPool.escape(opts.nick_name)
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

    //删除用户
    delUser: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'delete from user where user_id = ' + connPool.escape(opts.user_id);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //获取用户分组列表
    getUserGroupList: function (callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * , date_format(create_time, "%Y-%m-%d %T") as create_time from user_group order by group_id desc';

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //保存分组信息
    saveUserGroup: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (opts.group_id) {
                //传入ID，则编辑
                var arr = [],
                    SQL = '';

                arr.push('group_name = ' + connPool.escape(opts.group_name));

                SQL = 'update user_group set ' + arr.join(',') + ' where group_id = ' + connPool.escape(opts.group_id);

                connection.query(SQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });

            } else {
                //没传入ID，则新增
                var SQL = 'insert into user_group (group_name) ',
                    values = [
                        connPool.escape(opts.group_name)
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

    //删除分组
    delUserGroup: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var delUserSQL = 'delete from user where group_id = ' + connPool.escape(opts.group_id),
                delGroupSQL = 'delete from user_group where group_id = ' + connPool.escape(opts.group_id);

            //开启事务
            connection.beginTransaction(function (err){
                if (err) throw err;

                connection.query(delUserSQL, function (err, result) {
                    if (err) throw err;

                    connection.query(delGroupSQL, function (err, result) {
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
    },
};
