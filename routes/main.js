var _ = require('underscore'), //引入 underscore

    //common 模块
    commonMod = require('./modules/commonMod'),
    //user 模块
    userMod = require('./modules/userMod'),
    //activity 模块
    activityMod = require('./modules/activityMod'),
    //activityPage 模块
    activityPageMod = require('./modules/activityPageMod'),
    //area 模块
    areaMod = require('./modules/areaMod'),

    //路由配置
    config = {
        get: {
            '/common/image': commonMod.image,

            '/user/logout': userMod.logout,
            '/user/getUserList': userMod.getUserList,
            '/user/checkStatus': userMod.checkStatus,
            '/user/getUserInfo': userMod.getUserInfo,
            '/user/getUserGroupList': userMod.getUserGroupList,

            '/activity/getActivityList': activityMod.getActivityList,
            '/activity/getActivityDetail': activityMod.getActivityDetail,

            '/activityPage/getActivityPageList': activityPageMod.getActivityPageList,
            '/activityPage/getActivityPageDetail': activityPageMod.getActivityPageDetail,

            '/area/getAreaList': areaMod.getAreaList,
        },
        post: {
            '/common/imageUpload': commonMod.imageUpload,

            '/user/login': userMod.login,
            '/user/changePassword': userMod.changePassword,
            '/user/add': userMod.saveUser,
            '/user/update': userMod.saveUser,
            '/user/del': userMod.delUser,
            '/user/addUserGroup': userMod.saveUserGroup,
            '/user/updateUserGroup': userMod.saveUserGroup,
            '/user/delUserGroup': userMod.delUserGroup,

            '/activity/add': activityMod.saveActivity,
            '/activity/update': activityMod.saveActivity,
            '/activity/del': activityMod.delActivity,

            '/activityPage/add': activityPageMod.saveActivityPage,
            '/activityPage/update': activityPageMod.saveActivityPage,
            '/activityPage/del': activityPageMod.delActivityPage,
            '/activityPage/export': activityPageMod.exportActivityPage,

            '/area/add': areaMod.saveArea,
            '/area/update': areaMod.saveArea,
            '/area/del': areaMod.delArea
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
