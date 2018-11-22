var userConf = require('./modules/userConf'),
    activityConf = require('./modules/activityConf'),
    activityPageConf = require('./modules/activityPageConf'),
    areaConf = require('./modules/areaConf'),

    //接口校验配置
    validateConfig = {
        //白名单 - 白名单里的接口，无须做登录校验
        whiteList: [
            '/user/login',
            '/user/logout',
            '/user/status'
        ],

        '/user/add': userConf.add,

        '/activity/add': activityConf.add,
        '/activity/update': activityConf.update,
        '/activity/del': activityConf.del,

        '/activityPage/getActivityPageList': activityPageConf.getActivityPageList,
        '/activityPage/add': activityPageConf.add,
        '/activityPage/update': activityPageConf.update,
        '/activityPage/del': activityPageConf.del,
        '/activityPage/export': activityPageConf.export,

        '/area/add': areaConf.add,
        '/area/update': areaConf.update,
        '/area/del': areaConf.del
    };

module.exports = validateConfig;
