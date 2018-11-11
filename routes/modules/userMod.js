var crypto = require('crypto'),
    userSrv = require('../../dataSrv/modules/userSrv');

module.exports = {
    //用户登录
    login: function (req, res) {
        var password = crypto.createHash('md5').update(req.body.password).digest('hex'),
            sendData = null;

        userSrv.check({
            userName: req.body.userName,
            password: password
        }, function (result) {

            if (result.length > 0) {

                var token = crypto.createHash('md5').update(result[0].id.toString()).digest('hex');

                res.cookie('userId', result[0].id, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });
                res.cookie('userName', result[0].user_name, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });
                res.cookie('userToken', token, {
                    maxAge: 6 * 60 * 60 * 1000/*,
                    domain: '.ofc_admin.com'*/
                });

                //用户ID存入session
                req.session.userId = result[0].id;

                sendData = {
                    code: 200,
                    data: result[0],
                    msg: '登录成功！'
                };
                res.send(sendData);

            } else {

                sendData = {
                    code: 9999,
                    data: result,
                    msg: '登录失败，用户名或密码错误！'
                };
                res.send(sendData);

            }
        });
    },

    //用户退出登录
    logout: function (req, res) {
        res.clearCookie('userId', {
            //domain: '.ofc_admin.com'
        });
        res.clearCookie('userName', {
            //domain: '.ofc_admin.com'
        });
        res.clearCookie('userToken', {
            //domain: '.ofc_admin.com'
        });

        //清除session
        req.sessionStore.destroy(req.session.id, function (err) {
            if (err) throw err;
            res.send({
                code: 200,
                data: null,
                msg: '退出登录成功！'
            });
        });
    },

    //获取用户列表
    getUserList: function (req, res, logger) {
        userSrv.getUserList(req.query, function (result) {
            res.send({
                code: 200,
                data: result,
                msg: ''
            });
        });
    },

    //检测用户登录状态
    checkStatus: function (req, res) {
        var result;

        if (req.query.token == req.cookies.userToken) {
            result = {
                code: 200,
                data: {
                    status: 1,
                    statusDec: '用户已登录',
                    userName: req.cookies.userName,
                    userRealName: req.cookies.userRealName,
                    userNickName: req.cookies.userNickName
                },
                msg: ''
            }
        } else {
            result = {
                code: 200,
                data: {
                    status: 0,
                    statusDec: '用户未登录',
                    userName: '',
                    userRealName: '',
                    userNickName: ''
                },
                msg: ''
            }
        }

        if (req.query.callback) {
            var sendStr = req.query.callback + '(' + JSON.stringify(result) + ');';
            res.send(sendStr);
        } else {
            res.send(result);
        }
    },

    //保存用户信息
    save: function (req, res) {
        var password = crypto.createHash('md5').update(req.body.password).digest('hex'),
            code = 1,
            msg = '',
            sendData = null;

        if (req.body.userName == '') {
            code = 0;
            msg = '用户名不能为空！';
        } else if (
            (typeof req.body.id == 'undefined' || (typeof req.body.id != 'undefined' && req.body.id == '')) &&
            req.body.password == ''
        ) {
            code = 0;
            msg = '密码不能为空！';
        } else if (req.body.userRealName == '') {
            code = 0;
            msg = '用户实名不能为空！';
        } else if (req.body.userNickName == '') {
            code = 0;
            msg = '用户花名不能为空！';
        } else if (req.body.userJobNumber == '') {
            code = 0;
            msg = '工号不能为空！';
        }

        if (code == 0) {
            sendData = {
                code: code,
                data: null,
                msg: msg
            };
            res.send(sendData);
            return;
        }

        userSrv.checkUserName({
            id: req.body.id,
            userName: req.body.userName
        }, function (result) {
            if (result.length > 0) {

                //用户名已被使用
                sendData = {
                    code: 9999,
                    data: null,
                    msg: '操作失败，用户名已存在！'
                };
                res.send(sendData);

            } else {
                //用户名未被使用
                saveUserMsg(req, res);
            }
        });

        function saveUserMsg (req, res) {
            userSrv.save({
                id: req.body.id || '',
                userName: req.body.userName,
                password: password,
                identityId: req.body.identityId,
                userRealName: req.body.userRealName,
                userNickName: req.body.userNickName,
                userJobNumber: req.body.userJobNumber
            }, function (result) {

                if (result.affectedRows > 0) {

                    sendData = {
                        code: 200,
                        data: result,
                        msg: '操作成功！'
                    };

                } else {

                    sendData = {
                        code: 9999,
                        data: result,
                        msg: '操作失败！'
                    };

                }

                res.send(sendData);

            });
        }
    }
};
