var activityPageSrv = require('../../dataSrv/modules/activityPageSrv'),
    apiCode = require('../../config/apiCode'),
    path = require('path'),
    fs = require('fs'),
    archiver = require('archiver'),
    _ = require('underscore'),
    deleteFolder = function (path, onlyContent) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (str) {
                var curPath = path + '/' + str;
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });

            if (!onlyContent) {
                fs.rmdirSync(path);
            }
        }
    };

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
    },

    exportActivityPage: function (req, res) {
        activityPageSrv.getActivityPageByActivityId({
            activity_id: req.body.activity_id
        }, function (result) {

            if (result.length > 0) {

                var tpl = fs.readFileSync(path.resolve(__dirname, '../../files/template/page-tpl.html'), 'utf-8'),
                    activityPath = path.resolve(__dirname, '../../files/activity-' + req.body.activity_id),
                    folder = result[0].folder,
                    zipPath = path.resolve(__dirname, '../../files/zip'),
                    zipFilePath = path.resolve(__dirname, '../../files/zip/' + folder + '.zip');

                //先清空zip目录下的压缩包
                deleteFolder(zipPath, true);

                result.forEach(function (item) {
                    var setting = item.setting ? JSON.parse(item.setting) : {
                            pageTitle: item.activity_name,
                            pageBgColor: '#ffffff',
                            moduleList: []
                        };

                    if (!fs.existsSync(activityPath)) {
                        fs.mkdirSync(activityPath);
                    }

                    var content = _.template(tpl)(setting);
                    fs.writeFileSync(activityPath + '/' + item.area_code + '.html', content);
                });

                if (!fs.existsSync(zipPath)) {
                    fs.mkdirSync(zipPath);
                }

                var output = fs.createWriteStream(zipFilePath),
                    archive = archiver('zip', {
                        zlib: {
                            level: 9
                        }
                    });

                output.on('close', function () {
                    //压缩包生成完毕
                    console.log(archive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                    //清除临时页面文件
                    deleteFolder(activityPath);
                    //导出压缩包
                    res.sendfile(zipFilePath);
                });

                archive.on('error', function(err) {
                    throw err;
                });

                archive.pipe(output);

                archive.directory(activityPath + '/', folder);

                archive.finalize();

            } else {
                res.send({
                    code: apiCode.dataBaseErr,
                    data: result,
                    msg: '导出失败'
                });
            }

        });
    }
};
