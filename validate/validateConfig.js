var userApiConf = require('./modules/user'),
    activityApiConf = require('./modules/activity'),

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
        '/activity/update': activityApiConf.update
    };

module.exports = validateConfig;
