var activityPageSrv = require('../../dataSrv/modules/activityPageSrv'),
    apiCode = require('../../config/apiCode');

module.exports = {
    //获取活动页面列表
    getActivityPageList: function (req, res) {
        activityPageSrv.getActivityPageList(req.query, function (result) {
            res.send({
                code: apiCode.success,
                data: result,
                msg: ''
            });
        });
    },

    //获取活动页面详情
    getActivityPageDetail: function (req, res) {
        activityPageSrv.getActivityPageDetail(req.query, function (result) {
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

    //保存活动页面信息
    saveActivityPage: function (req, res) {
        activityPageSrv.checkActivityPage({
            activity_id: req.body.activity_id,
            area_id: req.body.area_id
        }, function (result) {
            if (result.length > 0) {

                //该区域已创建活动
                res.send({
                    code: apiCode.logicErr,
                    data: null,
                    msg: '操作失败，该区域已经有活动页面了，不能重复创建'
                });

            } else {
                //该区域未创建活动
                savePage(req, res);
            }
        });

        function savePage (req, res) {
            activityPageSrv.saveActivityPage({
                page_id: req.body.page_id,
                activity_id: req.body.activity_id,
                area_id: req.body.area_id,
                setting: req.body.setting,
                operator: req.cookies.nick_name
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
    },

    //删除活动页面
    delActivityPage: function (req, res) {
        activityPageSrv.delActivityPage({
            page_id: req.body.page_id
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
