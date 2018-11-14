var activitySrv = require('../../dataSrv/modules/activitySrv'),
    apiCode = require('../../config/apiCode');

module.exports = {
    //获取活动列表
    getActivityList: function (req, res) {
        activitySrv.getActivityList(req.query, function (result) {
            res.send({
                code: apiCode.success,
                data: result,
                msg: ''
            });
        });
    },

    //保存活动信息
    save: function (req, res) {
        activitySrv.save({
            activity_id: req.body.activity_id,
            activity_name: req.body.activity_name,
            activity_desc: req.body.activity_desc,
            create_name: req.cookies.nick_name
        }, function (result) {

            if (result.affectedRows > 0) {
                res.send({
                    code: apiCode.success,
                    data: result,
                    msg: '操作成功'
                });
            } else {
                res.send({
                    code: apiCode.dataBaseErr,
                    data: result,
                    msg: '操作失败'
                });
            }

        });
    },

    //删除活动
    del: function (req, res) {
        activitySrv.del({
            activity_id: req.body.activity_id
        }, function (result) {

            if (result.affectedRows > 0) {
                res.send({
                    code: apiCode.success,
                    data: result,
                    msg: '操作成功'
                });
            } else {
                res.send({
                    code: apiCode.dataBaseErr,
                    data: result,
                    msg: '操作失败'
                });
            }

        });
    }
};
