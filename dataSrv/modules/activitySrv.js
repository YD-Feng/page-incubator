var connPool = require('../connPool');

module.exports = {
    //获取活动列表
    getActivityList: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var flag = 0,
                arr = [''],
                countSQL = 'select count(*) from activity',
                listSQL = 'select * , date_format(create_time, "%Y-%m-%d %T") as create_time from activity';

            if (!!opts.activity_name) {
                arr.push(
                    (flag == 0 ? 'where ' : 'and ') +
                    'activity_name like "%' + opts.activity_name + '%"'
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

            if (!opts.page_size) {
                opts.page_size = 10;
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
                        page_size: opts.page_size * 1,
                        list: listResult
                    });
                    connection.release();//释放链接
                });
            });
        });
    },

    //获取活动详情
    getActivityDetail: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * , date_format(create_time, "%Y-%m-%d %T") as create_time from activity where activity_id = ' + connPool.escape(opts.activity_id);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //保存活动信息
    saveActivity: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (opts.activity_id) {
                //传入ID，则编辑
                var arr = [],
                    SQL = '';

                arr.push('activity_name = ' + connPool.escape(opts.activity_name));
                arr.push('folder = ' + connPool.escape(opts.folder));

                if (typeof opts.activity_desc != 'undefined' && opts.activity_desc != '') {
                    //校验中间件不校验的非必传字段
                    arr.push('activity_desc = ' + connPool.escape(opts.activity_desc));
                }

                SQL = 'update activity set ' + arr.join(',') + ' where activity_id = ' + connPool.escape(opts.activity_id);

                connection.query(SQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });

            } else {
                //没传入ID，则新增
                var SQL = 'insert into activity (activity_name, folder, activity_desc, create_name) ',
                    values = [
                        connPool.escape(opts.activity_name),
                        connPool.escape(opts.folder),
                        connPool.escape(opts.activity_desc),
                        connPool.escape(opts.create_name)
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

    //删除活动
    delActivity: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var delPageSQL = 'delete from activity_page where activity_id = ' + connPool.escape(opts.activity_id),
                delActivitySQL = 'delete from activity where activity_id = ' + connPool.escape(opts.activity_id);

            //开启事务
            connection.beginTransaction(function (err) {
                if (err) throw err;

                connection.query(delPageSQL, function (err, delPageResult) {
                    if (err) throw err;

                    connection.query(delActivitySQL, function (err, delActivityResult) {
                        if (err) throw err;

                        connection.commit(function (err) {
                            if (err) {
                                connection.rollback(function () {
                                    throw err;
                                });
                            }
                            callback(delActivityResult);
                            connection.release();//释放链接
                        });
                    });
                });
            });
        });
    }
};
