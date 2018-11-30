var crypto = require('crypto'),
    userSrv = require('../../dataSrv/modules/userSrv'),
    apiCode = require('../../config/apiCode');

module.exports = {
    //用户登录
    login: function (req, res) {
        var sendData = null;

        userSrv.check({
            user_name: req.body.user_name,
            password: req.body.password
        }, function (result) {

            if (result.length > 0) {

                var token = crypto.createHash('md5').update(result[0].user_id.toString()).digest('hex');

                res.cookie('user_id', result[0].user_id, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });
                res.cookie('user_name', result[0].user_name, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });
                res.cookie('nick_name', result[0].nick_name, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });
                res.cookie('userToken', token, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });

                //用户ID存入session
                req.session.user_id = result[0].user_id;

                res.send({
                    code: apiCode.success,
                    data: result[0],
                    msg: '登录成功'
                });

            } else {

                res.send({
                    code: apiCode.loginErr,
                    data: result,
                    msg: '登录失败，用户名或密码错误'
                });

            }
        });
    },

    changePassword: function (req, res) {
        userSrv.changePassword({
            user_id: req.cookies.user_id,
            old_password: req.body.old_password,
            new_password: req.body.new_password
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
                    data: null,
                    msg: result.message
                });
            }
        });
    },

    //用户退出登录
    logout: function (req, res) {
        res.clearCookie('user_id', {
            //domain: '.ofc_admin.com'
        });
        res.clearCookie('user_name', {
            //domain: '.ofc_admin.com'
        });
        res.clearCookie('user_token', {
            //domain: '.ofc_admin.com'
        });

        //清除session
        req.sessionStore.destroy(req.session.user_id, function (err) {
            if (err) throw err;
            res.send({
                code: apiCode.success,
                data: null,
                msg: '退出登录成功'
            });
        });
    },

    //获取用户列表
    getUserList: function (req, res, logger) {
        userSrv.getUserList(req.query, function (result) {
            res.send({
                code: apiCode.success,
                data: result,
                msg: ''
            });
        });
    },

    //获取某个用户的信息
    getUserInfo: function (req, res, logger) {
        userSrv.getUserInfo({
            user_id: req.cookies.user_id
        }, function (result) {
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
                    msg: '没有找到该用户'
                });
            }
        });
    },

    //检测用户登录状态
    checkStatus: function (req, res) {
        var result;

        if (req.query.token == req.cookies.userToken) {
            result = {
                code: apiCode.success,
                data: {
                    status: 1,
                    statusDec: '用户已登录',
                    user_name: req.cookies.user_name
                },
                msg: ''
            }
        } else {
            result = {
                code: apiCode.success,
                data: {
                    status: 0,
                    statusDec: '用户未登录',
                    user_name: '',
                },
                msg: ''
            }
        }

        if (req.query.callback) {
            res.jsonp(result);
        } else {
            res.send(result);
        }
    },

    //保存用户信息
    saveUser: function (req, res) {
        userSrv.checkUserName({
            user_id: req.body.user_id,
            user_name: req.body.user_name
        }, function (result) {
            if (result.length > 0) {

                //用户名已被使用
                res.send({
                    code: apiCode.logicErr,
                    data: null,
                    msg: '操作失败，用户名已存在'
                });

            } else {
                //用户名未被使用
                saveUserMsg(req, res);
            }
        });

        function saveUserMsg (req, res) {
            userSrv.saveUser({
                user_id: req.body.user_id || '',
                user_name: req.body.user_name,
                password: req.body.password,
                group_id: req.body.group_id,
                nick_name: req.body.nick_name
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

    //删除用户
    delUser: function (req, res) {
        userSrv.delUser({
            user_id: req.body.user_id
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

    //获取用户分组列表
    getUserGroupList: function (req, res) {
        userSrv.getUserGroupList(function (result) {
            res.send({
                code: apiCode.success,
                data: result,
                msg: ''
            });
        });
    },

    //保存用户信息
    saveUserGroup: function (req, res) {
        userSrv.saveUserGroup({
            group_id: req.body.group_id || '',
            group_name: req.body.group_name
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

    //删除用户
    delUserGroup: function (req, res) {
        userSrv.delUserGroup({
            group_id: req.body.group_id
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
};
