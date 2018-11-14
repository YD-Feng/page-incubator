var apiCode = require('./../config/apiCode');

var validateEngine = function (logger) {
        return function (req, res, next) {
            var validateConfig = require('./validateConfig'),
                validateField = require('./validateField'),
                field,
                result,
                params = req.method.toUpperCase() == 'POST' ? req.body : req.query,
                flag = true,
                path = req.path;

            if (validateConfig.whiteList.indexOf(path) == -1) {
                if (!req.cookies.userToken) {

                    logger && logger.error(path + ' 接口校验错误：未登录');
                    res.send({
                        code: apiCode.unLoginErr,
                        data: null,
                        msg: '接口校验错误：未登录'
                    });
                    flag = false;

                }
            }

            if (flag && validateConfig[path]) {
                for (field in validateConfig[path]) {
                    var arr = validateConfig[path][field].split('@');

                    result = validateField(params[field], arr[0], field, arr[1], params, validateConfig[path]);

                    if (result.code == apiCode.validateErr) {

                        logger && logger.error(path + ' ' + result.msg);
                        res.send(result);
                        flag = false;
                        break;

                    }
                }
            }

            if (flag) {
                next();
            }
        };
    };

module.exports = validateEngine;
