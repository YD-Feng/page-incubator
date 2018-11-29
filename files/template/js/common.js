//Date方法拓展
Date.prototype.format = function (fmt) {
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        'H+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds() //毫秒
    };

    var week = {
        '0': '/u65e5',
        '1': '/u4e00',
        '2': '/u4e8c',
        '3': '/u4e09',
        '4': '/u56db',
        '5': '/u4e94',
        '6': '/u516d'
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + '']);
    }

    for (var k in o) {
        if (new RegExp('('+ k +')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

Vue.http.options.credentials = true;
Vue.http.headers.common['laimi-client-version'] = 'ios.store.client:2.35.0';
Vue.http.headers.common['Laimi-User-Agent'] = 'mobile';
Vue.http.headers.common['Laimi-DeviceModel'] = 'iPhone6';
Vue.http.headers.common['Laimi-OSVersion'] = 'iOS 9.3';

//设置请求全局处理
Vue.http.interceptors.push(function (request, next) {
    //返回处理
    next(function (response) {

        var _this = this,
            data = response.body;

        if (!request.withoutGlobalCheck) {

            if (response.ok && data.code != 200) {

                //预留code统一处理
                /*if (data.code == 401) {
                 //未登录
                 }*/

            } else if (!response.ok) {

                var errorStr = '';
                if (response.status === 400) {
                    errorStr = '服务器无法解析请求';
                } else if (response.status === 401) {
                    errorStr = '请先登录授权';
                } else if (response.status === 403) {
                    errorStr = '服务器拒绝请求';
                } else if (response.status === 404) {
                    errorStr = '服务器未找到请求页';
                } else if (response.status === 500) {
                    errorStr = '服务器遇到错误，无法完成请求';
                } else if (response.status === 501) {
                    errorStr = '服务器不支持所请求的功能';
                } else if (response.status === 502) {
                    errorStr = '服务器从上游服务器收到一个无效的响应';
                } else if (response.status === 503) {
                    errorStr = '服务器繁忙';
                } else if (response.status === 504) {
                    errorStr = '网关超时';
                } else if (response.status === 455) {
                    errorStr = '版本过低';
                }
                throw new Error(errorStr);

            }

        }
    });
});

Vue.prototype.$get = function (opts) {
    var config = {};

    config.method = 'get';
    config.url = opts.url;
    config.params = opts.data || {};
    config.withoutGlobalCheck = opts.withoutGlobalCheck || false;

    return this.$http(config).then(function (res) {
        // res.body = JSON.parse(res.bodyText.replace(/:(\d{19})/g, ":\"$1\""));
        if (res.body.data.code == 200) {
            opts.success && opts.success(res.body.data);
        } else {
            opts.error && opts.error(res.body);
        }
    });
};

Vue.prototype.$post = function (opts, emulateJSON) {
    var config = {};
    config.method = 'post';
    config.url = opts.url;
    config.body = opts.data || {};
    config.noLoading = opts.noLoading || false;
    config.withoutGlobalCheck = opts.withoutGlobalCheck || false;
    config.emulateJSON = emulateJSON ? true : false;

    return this.$http(config).then(function (res) {
        if (res.body.data.code == 200) {
            opts.success && opts.success(res.body.data);
        } else {
            opts.error && opts.error(res.body);
        }
    });
};

/*
 * 参数说明：
 * name 【String】 Cookie名
 * value 【String】 Cookie值
 * time 【Int】 过期时长（单位：毫秒）
 * domain 【String】 Cookie域，可缺省，默认值为空字符串
 * path 【String】 Cookie路径，可缺省，默认值为 '/'
 * */
Vue.prototype.$setCookie = function (name, value, time, domain, path) {
    var cookieArr = [],
        _path = path || '/',
        _domain = domain || '',
        expire = new Date();

    expire.setTime(expire.getTime() + time);

    cookieArr.push(name + '=' + escape(value) + '; ');
    cookieArr.push(time ? ('expires=' + expire.toGMTString() + '; ') : '');
    cookieArr.push('path=' + _path + '; ');
    cookieArr.push('domain=' + _domain + ';');
    document.cookie = cookieArr.join('');
};

/*
 * 参数说明：
 * name 【String】 Cookie名
 * */
Vue.prototype.$getCookie = function (name) {
    var reg = new RegExp('(?:^|;+|\\s+)' + name + '=([^;]*)'),
        m = document.cookie.match(reg);

    return unescape(decodeURIComponent(!m ? '' : m[1]));
};

/*
 * 参数说明：
 * name 【String】 Cookie名
 * domain 【String】 Cookie域，可缺省，默认值为空字符串
 * path 【String】 Cookie路径，可缺省，默认值为 '/'
 * */
Vue.prototype.$removeCookie = function (name, domain, path) {
    var _this = this,
        cookieArr = [],
        _path = path || _this.options.path,
        _domain = domain || _this.options.domain;

    cookieArr.push(name + '=; ');
    cookieArr.push('expires=Mon, 26 Jul 1997 05:00:00 GMT; ');
    cookieArr.push('path=' + _path + '; ');
    cookieArr.push('domain=' + _domain + ';');
    document.cookie = cookieArr.join('');
};

//APP接口回调
window.customCallbacks = {};
function receiveAppCallback (platform, msgHandler, response) {
    //假如获取用户信息 getUser，则调用 window.customCallbacks.getUser 做回调
    //window.customCallbacks.getUser 在全局方法 $fetchUserFromNative 内（该方法在 app.js 中）被定义/重写
    window.customCallbacks[msgHandler](JSON.parse(response), platform);
};

//通过APP提供的接口获取用户信息
Vue.prototype.$fetchUserFromNative = function (callback) {
    try {
        window.appDispose.getUser();
        //定义/重写获取用户信息后的回调
        window.customCallbacks.getUser = callback;
    } catch (e) {
        console.log('Call Android Exception : ' + e.toString());
    }

    try {
        window.webkit.messageHandlers.getUser.postMessage(null);
        //定义/重写获取用户信息后的回调
        window.customCallbacks.getUser = callback;
    } catch (e) {
        console.log('Call iOS Exception : ' + e.toString());
    }
};

// 分享方法
Vue.prototype.$fetchShareFromNative = function (shareInfo, callback) {
    try {
        window.appDispose.setShareInfo(shareInfo);
        //定义/重写获取用户信息后的回调
        window.customCallbacks.setShareInfo = callback;
    } catch (e) {
        console.log('Call Android Exception : ' + e.toString());
    }

    try {
        window.webkit.messageHandlers.setShareInfo.postMessage(shareInfo);
        //定义/重写获取用户信息后的回调
        window.customCallbacks.setShareInfo = callback;
    } catch (e) {
        console.log('Call ios Exception : ' + e.toString());
    }
};

// 打开小程序
/**
 *
 * @param params
 * {
 *     path: '小程序指定页面',
 *     miniProgramType: '小程序版本', // test
 *  }
 */
Vue.prototype.launchMiniProgram = function(params) {
    // let program = '{"path": "pages/mine/my-balance", "miniProgramType": "release"}';
    // Android
    try {
        window.appDispose.launchMiniProgram(params);
        return;
    } catch (e) {
        console.log('Call Android Exception : ' + e.toString());
    }
    // iOS8+
    try {
        window.webkit.messageHandlers.launchMiniProgram.postMessage(params);
        return;
    } catch (e) {
        console.log('Call iOS Exception : ' + e.toString());
    }
};

// 登录方法 用于测试
Vue.prototype.$loginTest = function (userInfo, calllback) {
    this.$post({
        url: '/api/auth/token',
        data: {
            "isWeb": true,
            "loginPass": userInfo.loginPass,
            "loginName": userInfo.loginName
        },
        success (res) {
            calllback(res);
        }
    });
};

//自定义指令
var nodeList = [],
    ctx = '@clickOutside',
    mouseDownEvent;

document.addEventListener('mousedown', function (e) {
    mouseDownEvent = e;
}, false);

document.addEventListener('mouseup', function (e) {
    nodeList.forEach(function (node) {
        node[ctx].documentHandler(e, mouseDownEvent);
    });
}, false);

//点击元素以外区域时触发回调函数指令
Vue.directive('clickOutside', {
    bind (el, binding, vnode) {
        var id = nodeList.push(el) - 1;
        var documentHandler = function (mouseup, mousedown) {
            mouseup = mouseup ? mouseup : {};
            mousedown = mousedown ? mousedown : {};

            if (!vnode.context ||
                !mouseup.target ||
                !mousedown.target ||
                el.contains(mouseup.target) ||
                (vnode.context.popperElm &&
                (vnode.context.popperElm.contains(mouseup.target) ||
                vnode.context.popperElm.contains(mousedown.target)))) return;

            if (binding.expression &&
                el[ctx].methodName &&
                vnode.context[el[ctx].methodName]) {
                vnode.context[el[ctx].methodName]();
            } else {
                el[ctx].bindingFn && el[ctx].bindingFn();
            }
        };
        el[ctx] = {
            id,
            documentHandler,
            methodName: binding.expression,
            bindingFn: binding.value
        };
    },
    update (el, binding) {
        el[ctx].methodName = binding.expression;
        el[ctx].bindingFn = binding.value;
    },
    unbind (el) {
        var len = nodeList.length;

        for (var i = 0; i < len; i++) {
            if (nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1);
                break;
            }
        }
    }
});
