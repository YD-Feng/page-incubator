var areaSrv = require('../../dataSrv/modules/areaSrv'),
    apiCode = require('../../config/apiCode');

module.exports = {
    //获取区域列表
    getAreaList: function (req, res) {
        areaSrv.getAreaList(function (result) {
            res.send({
                code: apiCode.success,
                data: result,
                msg: ''
            });
        });
    },

    //保存区域信息
    saveArea: function (req, res) {
        areaSrv.saveArea({
            area_id: req.body.area_id,
            area_name: req.body.area_name,
            area_code: req.body.area_code
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

    //删除区域
    delArea: function (req, res) {
        areaSrv.delArea({
            area_id: req.body.area_id
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
