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

    //获取活动详情
    getActivityDetail: function (req, res) {
        activitySrv.getActivityDetail(req.query, function (result) {
            if (result.length > 0) {
                res.send({
                    code: apiCode.success,
                    data: result[0],
                    msg: ''
                });
            } else {
                res.send({
                    code: apiCode.noDataErr,
                    data: result,
                    msg: '没有找到该活动'
                });
            }
        });
    },

    //保存活动信息
    saveActivity: function (req, res) {
        activitySrv.saveActivity({
            activity_id: req.body.activity_id,
            activity_name: req.body.activity_name,
            folder: req.body.folder,
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
    delActivity: function (req, res) {
        activitySrv.delActivity({
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
