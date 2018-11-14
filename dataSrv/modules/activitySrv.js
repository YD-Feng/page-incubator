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

            if (!opts.pageSize) {
                opts.pageSize = 30;
            }

            if (!opts.currentPage) {
                opts.currentPage = 1;
            }

            listSQL +=
                ' order by create_time desc limit ' +
                (opts.pageSize * (opts.currentPage - 1)) +
                ',' +
                (opts.pageSize * opts.currentPage);

            connection.query(countSQL, function (err, countResult) {
                if (err) throw err;

                connection.query(listSQL, function (err, listResult) {
                    if (err) throw err;
                    callback({
                        total: countResult[0]['count(*)'],
                        page: opts.currentPage,
                        pageSize: opts.pageSize,
                        list: listResult
                    });
                    connection.release();//释放链接
                });
            });
        });
    },

    //保存活动信息
    save: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (opts.activity_id) {
                //传入ID，则编辑
                var arr = [],
                    SQL = '';

                arr.push('activity_name = ' + connPool.escape(opts.activity_name));

                if (opts.activity_desc) {
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
                var SQL = 'insert into activity (activity_name, activity_desc, create_name) ',
                    values = [
                        connPool.escape(opts.activity_name),
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
};
