var userApiConf = require('./modules/user'),
    activityApiConf = require('./modules/activity'),
    activityPageApiConf = require('./modules/activityPage'),
    areaApiConf = require('./modules/area'),

    //接口校验配置
    validateConfig = {
        //白名单 - 白名单里的接口，无须做登录校验
        whiteList: [
            '/user/login',
            '/user/logout',
            '/user/status'
        ],

        '/user/add': userApiConf.add,

        '/activity/add': activityApiConf.add,
        '/activity/update': activityApiConf.update,
        '/activity/del': activityApiConf.del,

        '/activityPage/getActivityPageList': activityPageApiConf.getActivityPageList,
        '/activityPage/add': activityPageApiConf.add,
        '/activityPage/update': activityPageApiConf.update,
        '/activityPage/del': activityPageApiConf.del,

        '/area/add': areaApiConf.add,
        '/area/update': areaApiConf.update,
        '/area/del': areaApiConf.del
    };

module.exports = validateConfig;
