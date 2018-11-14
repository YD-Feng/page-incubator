var _ = require('underscore'), //引入 underscore

    //common 模块
    commonMod = require('./modules/commonMod'),
    //user 模块
    userMod = require('./modules/userMod'),
    //activity 模块
    activityMod = require('./modules/activityMod'),

    //路由配置
    config = {
        get: {
            '/common/image': commonMod.image,
            '/user/logout': userMod.logout,
            '/user/getUserList': userMod.getUserList,
            '/user/checkStatus': userMod.checkStatus,
            '/user/getUserGroupList': userMod.getUserGroupList,
            '/activity/getActivityList': activityMod.getActivityList
        },
        post: {
            '/common/imageUpload': commonMod.imageUpload,
            '/user/login': userMod.login,
            '/user/add': userMod.save,
            '/activity/add': activityMod.save,
            '/activity/update': activityMod.save
        }
    };



module.exports = function (app, logger) {

    //分析路由配置对象，逐一处理
    _.each(config, function (subConfig, method) {

        _.each(subConfig, function (func, url) {

            app[method](url, function (req, res) {
                func(req, res, logger);
            });

        });

    });

};
