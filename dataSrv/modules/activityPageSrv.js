var connPool = require('../connPool');

module.exports = {
    //获取活动页面列表
    getActivityPageList: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var countSQL = 'select count(*) from activity_page where activity_id = ' + connPool.escape(opts.activity_id),
                listSQL = 'select activity_page.*, area.area_name, area.area_code' +
                    ' , date_format(activity_page.create_time, "%Y-%m-%d %T") as create_time' +
                    ' , date_format(activity_page.last_update_time, "%Y-%m-%d %T") as last_update_time' +
                    ' from activity_page' +
                    ' inner join area on activity_page.area_id = area.area_id' +
                    ' where activity_page.activity_id = ' + connPool.escape(opts.activity_id);

            if (!opts.page_size) {
                opts.page_size = 10;
            }

            if (!opts.page) {
                opts.page = 1;
            }

            listSQL +=
                ' order by activity_page.create_time desc limit ' +
                (opts.page_size * (opts.page - 1)) +
                ',' +
                (opts.page_size * opts.page);

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

    //获取活动页面详情
    getActivityPageDetail: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * , date_format(create_time, "%Y-%m-%d %T") as create_time from activity_page where activity_id = ' + connPool.escape(opts.activity_id);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //查找某活动在某个区域的活动页面
    checkActivityPage: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'select * from activity_page where activity_id = ' + connPool.escape(opts.activity_id) + ' and area_id = ' + connPool.escape(opts.area_id);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    },

    //保存活动页面信息
    saveActivityPage: function (opts, callback) {
        connPool.getConnection(function (err, connection) {

            if (opts.page_id) {
                //传入ID，则编辑
                var arr = [],
                    SQL = '';

                //校验中间件已校验的必传字段，无须判断
                arr.push('setting = ' + connPool.escape(opts.setting));
                arr.push('last_update_name = ' + connPool.escape(opts.operator));
                arr.push('last_update_time = getdate()');

                SQL = 'update activity_page set ' + arr.join(',') +
                    ' where page_id = ' + connPool.escape(opts.page_id) +
                    ' and activity_id = ' + connPool.escape(opts.activity_id) +
                    ' and area_id = ' + connPool.escape(opts.area_id);

                connection.query(SQL, function (err, result) {
                    if (err) throw err;
                    callback(result);
                    connection.release();//释放链接
                });

            } else {
                //没传入ID，则新增
                var SQL = 'insert into activity_page (activity_id, area_id, setting, create_name, last_update_name) ',
                    values = [
                        connPool.escape(opts.activity_id),
                        connPool.escape(opts.area_id),
                        connPool.escape(opts.setting || ''),
                        connPool.escape(opts.operator),
                        connPool.escape(opts.operator)
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

    //删除活动页面
    delActivityPage: function (opts, callback) {
        connPool.getConnection(function (err, connection) {
            var SQL = 'delete from activity_page where page_id = ' + connPool.escape(opts.page_id);

            connection.query(SQL, function (err, result) {
                if (err) throw err;
                callback(result);
                connection.release();//释放链接
            });
        });
    }
};
