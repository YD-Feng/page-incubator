var validateConfig = {
    //白名单 - 白名单里的接口，无须做登录校验
    whiteList: [
        '/user/list'
    ],
    '/user/list': require('./modules/userList')
};

module.exports = validateConfig;
