var apiCode = require('./../config/apiCode');

var validateField = function (fieldVal, rulesStr, fieldNameEn, fieldNameCn, params, config) {
    var rulesArr = rulesStr.split(/\[|,|\]/),
        rules = [],
        result = null,
        hasErr = false,

        /* 内部函数 */
        createResult = function (msg) {
            return {
                code: msg ? apiCode.validateErr : apiCode.success,
                data: null,
                msg: msg ? '接口校验错误：' + msg : ''
            }
        },

        /* 正则池 */
        regPool = {
            date: {
                reg: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/,
                text: '是无效的日期格式'
            },
            dateTime: {
                reg: /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/,
                text: '是无效的日期格式'
            },
            phone: {
                reg: /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
                text: '是无效的电话号码'
            },
            mobile: {
                reg: /^[1][3-8]+\d{9}/,
                text: '是无效的手机号'
            },
            email: {
                reg: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
                text: '是无效的邮件地址'
            },
            integer: {
                reg: /^[\-\+]?\d+$/,
                text: '是无效的整数'
            },
            number: {
                reg:  /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
                text: '是无效的数值'
            },
            ipv4: {
                reg: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
                text: '是无效的IP地址'
            },
            url: {
                reg:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                text:'是无效的网址'
            },
            onlyNumber: {
                reg: /^[0-9]+$/,
                text: '只能是纯数字'
            },
            notZeroNumber: {
                reg: /^(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$/,
                text: '只能是非0数字'
            },
            onlyLetter: {
                reg: /^[a-zA-Z]+$/,
                text: '只能是英文字母'
            },
            onlyLetterNumber: {
                reg: /^[0-9a-zA-Z]+$/,
                text: '只能是数字与英文字母'
            },
            chinese: {
                reg: /^[\u4E00-\u9FA5]+$/,
                text: '不能包含非中文字符'
            },
            noChinese: {
                reg: /^[^\u4e00-\u9fa5]{0,}$/,
                text: '不能包含中文字符'
            },
            chineseIdCard: {
                reg: /^(\d{18}|\d{15}|\d{17}[xX])$/,
                text: '是无效的身份证号码'
            },
            chineseZipCode: {
                reg: /^\d{6}$/,
                text: '是无效的邮政编码'
            },
            qq: {
                reg: /^[1-9]\d{4,10}$/,
                text: '是无效的QQ号码'
            }
        },

        /* 校验函数 */
        required = function (fieldVal, fieldNameEn, fieldNameCn) {
            if (typeof fieldVal == 'undefined' || fieldVal == '') {
                return createResult((fieldNameCn || fieldNameEn) + '为必传参数且不能为空');
            }
            return createResult();
        },

        minSize = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            if (fieldVal.length < condition) {
                return createResult((fieldNameCn || fieldNameEn) + '的长度不能小于' + condition);
            }
            return createResult();
        },

        maxSize = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            if (fieldVal.length > condition) {
                return createResult((fieldNameCn || fieldNameEn) + '的长度不能大于' + condition);
            }
            return createResult();
        },

        min = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            var _fieldVal = fieldVal * 1,
                _condition = condition * 1;

            if (_fieldVal < _condition) {
                return createResult((fieldNameCn || fieldNameEn) + '不能小于' + condition);
            }
            return createResult();
        },

        max = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            var _fieldVal = fieldVal * 1,
                _condition = condition * 1;

            if (_fieldVal > _condition) {
                return createResult((fieldNameCn || fieldNameEn) + '不能大于' + condition);
            }
            return createResult();
        },

        minChecked = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            if (typeof fieldVal != 'undefined' && fieldVal != '' && fieldVal.split(',').length < condition * 1) {
                return createResult((fieldNameCn || fieldNameEn) + '至少要选' + condition + '项');
            }
            return createResult();
        },

        maxChecked = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            if (typeof fieldVal != 'undefined' && fieldVal != '' && fieldVal.split(',').length > condition * 1) {
                return createResult((fieldNameCn || fieldNameEn) + '不能选多于' + condition + '项');
            }
            return createResult();
        },

        dateBefore = function (fieldVal, condition, fieldNameEn, fieldNameCn, params, config) {
            if (typeof fieldVal != 'undefined' &&
                fieldVal != '' &&
                typeof params[condition] != 'undefined' &&
                params[condition] != '') {

                var dateReg = new RegExp(regPool.date.reg),
                    dateTimeReg = new RegExp(regPool.dateTime.reg);

                if ( (dateReg.test(fieldVal) || dateTimeReg.test(fieldVal)) && (dateReg.test(params[condition]) || dateTimeReg.test(params[condition])) ) {
                    var conditionFieldNameCn = config[condition].split('@')[1];

                    if (new Date(fieldVal.toString()) > new Date(params[condition].toString())) {
                        return createResult((fieldNameCn || fieldNameEn) + '不能大于' + (conditionFieldNameCn || condition));
                    }
                }
            }
            return createResult();
        },

        dateAfter = function (fieldVal, condition, fieldNameEn, fieldNameCn, params, config) {
            if (typeof fieldVal != 'undefined' &&
                fieldVal != '' &&
                typeof params[condition] != 'undefined' &&
                params[condition] != '') {

                var dateReg = new RegExp(regPool.date.reg),
                    dateTimeReg = new RegExp(regPool.dateTime.reg);

                if ( (dateReg.test(fieldVal) || dateTimeReg.test(fieldVal)) && (dateReg.test(params[condition]) || dateTimeReg.test(params[condition])) ) {
                    var conditionFieldNameCn = config[condition].split('@')[1];

                    if (new Date(fieldVal.toString()) < new Date(params[condition].toString())) {
                        return createResult((fieldNameCn || fieldNameEn) + '不能小于' + (conditionFieldNameCn || condition));
                    }
                }
            }
            return createResult();
        },

        equal = function (fieldVal, condition, fieldNameEn, fieldNameCn, params, config) {
            if (fieldVal != params[condition]) {
                var conditionFieldNameCn = config[condition].split('@')[1];
                return createResult((fieldNameCn || fieldNameEn) + '必须的值与' + (conditionFieldNameCn || condition) + '相等');
            }
            return createResult();
        },

        custom = function (fieldVal, condition, fieldNameEn, fieldNameCn) {
            if (typeof fieldVal != 'undefined' && fieldVal != '' && regPool[condition]) {
                var reg = new RegExp(regPool[condition].reg);

                if (!reg.test(fieldVal)) {
                    return createResult((fieldNameCn || fieldNameEn) + '的值' + regPool[condition].text);
                }
            }
            return createResult();
        };

    for (var i = 0, len = rulesArr.length; i < len; i++) {
        //移除空格符
        var curRule = rulesArr[i].replace(' ', '');
        if (curRule !== '') {
            rules.push(curRule);
        }
    }

    for (var i = 0, len = rules.length; i < len; i++) {
        if (hasErr) {
            break;
        }

        switch (rules[i]) {
            case 'required':
                result = required(fieldVal, fieldNameEn, fieldNameCn);
                break;

            case 'custom':
                result = custom(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'minSize':
                result = minSize(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'maxSize':
                result = maxSize(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'min':
                result = min(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'max':
                result = max(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'dateBefore':
                result = dateBefore(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn, params, config);
                break;

            case 'dateAfter':
                result = dateAfter(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn, params, config);
                break;

            case 'minChecked':
                result = minChecked(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'maxChecked':
                result = maxChecked(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn);
                break;

            case 'equal':
                result = equal(fieldVal, rules[i + 1], fieldNameEn, fieldNameCn, params, config);
                break;

            default:
                result = createResult();
                break;
        }

        hasErr = result.code != 0;
    }

    return result;
};

module.exports = validateField;
