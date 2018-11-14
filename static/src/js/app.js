'use strict';

//加载初始化样式
require('element-style');
require('./../less/common.less');

var Vue = require('vue'),
    VueRouter = require('vue-router'),
    Vuex = require('vuex'),
    VuexLogger = require('vuex-logger'),
    VueResource = require('vue-resource'),
    ElementUI = require('element-ui'),
    VueBar = require('./vue-bar'),
    //定义请求池 和 loading对象缓存
    xhrPool = {
        count: 0
    },
    loadingSrv = null;

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(ElementUI);
Vue.use(VueBar);

Vue.http.options.emulateJSON = true;

//实例化 vue-router
window.router = new VueRouter({
    saveScrollPosition: true,
    transitionOnLoad: true,
    routes: require('./routes')
});

router.beforeEach(function (to, from, next) {
    if (to.name != 'login' && !Vue.prototype.$getCookie('userToken')) {
        router.push({
            path: '/login'
        });
    } else {
        next();
    }
});

//实例化 store
var store = new Vuex.Store({
    modules: {
        flags: require('./store/flags'),
        dict: require('./store/dict')
    },
    strict: false,
    middlewares: [VuexLogger()]
});

// Vue-resource 全局配置及全局方法定义
Vue.http.interceptors.push(function (request, next) {

    if (!request.noLoading) {
        if (typeof xhrPool[request.url] == 'undefined') {
            xhrPool[request.url] = request;
            xhrPool['count'] = xhrPool['count'] + 1;
        } else {
            xhrPool[request.url] = request;
        }

        if (xhrPool['count'] > 0) {
            loadingSrv = this.$loading();
        }
    }

    //返回处理
    next(function (response) {
        var _this = this,
            data = response.body;

        if (!request.noLoading) {
            if (xhrPool[request.url]) {
                delete xhrPool[request.url];
                xhrPool['count'] = xhrPool['count'] - 1;
            }

            if (xhrPool['count'] == 0) {
                loadingSrv.close();
            }
        }

        if (!request.withoutGlobalCheck) {

            if (response.ok && data.code != 200) {

                if (data.code == 401) {
                    router.push({
                        path: '/login'
                    });
                } else {
                    _this && _this.$message.error(data.msg || '状态码异常');
                }

            } else if (!response.ok) {

                if (response.status > 400 && response.status < 500) {
                    _this && _this.$message.error('请求方式或参数出现异常');
                } else if (response.status >= 500) {
                    _this && _this.$message.error('服务器暂时在维护，请稍后重试');
                }

            }

        }
    });
});

Vue.prototype.$get = function (opts) {
    var config = {};

    config.method = 'get';
    config.url = opts.url;
    config.params = opts.data || {};
    config.noLoading = opts.noLoading || false;
    config.withoutGlobalCheck = opts.withoutGlobalCheck || false;

    this.$http(config).then(function (res) {
        if (res.body.code == 200) {
            opts.success && opts.success(res.body);
        } else {
            opts.error && opts.error(res.body);
        }
    });
};

Vue.prototype.$post = function (opts) {
    var config = {};

    config.method = 'post';
    config.url = opts.url;
    config.body = opts.data || {};
    config.noLoading = opts.noLoading || false;
    config.withoutGlobalCheck = opts.withoutGlobalCheck || false;

    this.$http(config).then(function (res) {
        if (res.body.code == 200) {
            opts.success && opts.success(res.body);
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

//高度屏幕自适应指令
Vue.directive('autoHeight', {
    bind: function (el, binding, vnode) {
        var delHeight = binding.value ? binding.value.delHeight || 0 : 0;
        el.style['height'] = (window.innerHeight - delHeight) + 'px';
        el.style['max-height'] = (window.innerHeight - delHeight) + 'px';

        window.onresize = function () {
            el.style['height'] = (window.innerHeight - delHeight) + 'px';
            el.style['max-height'] = (window.innerHeight - delHeight) + 'px';
        }
    }
});

//全局 【文件下载、导出】 专用 form 对象
window.fileDownForm = null;
//插入隐藏域，用于避免浏览器拦截弹窗
var hiddenFrame = document.createElement('iframe');
hiddenFrame.name = 'hiddenFrame';
hiddenFrame.style.display = 'none';
document.body.appendChild(hiddenFrame);

//下载、导出文件
Vue.prototype.$exportByForm = function (config) {
    var form = window.fileDownForm;

    if (form) {
        form.remove();
    }

    form = document.createElement('form');
    form.method = config.method || 'get';
    form.action = config.url;
    form.target = 'hiddenFrame';

    if (config.data && typeof config.data == 'object') {
        for (var key in config.data) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = config.data[key];
            form.appendChild(input);
        }
    }

    document.body.appendChild(form);
    form.submit();
};

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
    bind: function (el, binding, vnode) {
        var id = nodeList.push(el) - 1;
        var documentHandler = function (mouseup, mousedown) {
            var mouseup = mouseup || {},
                mousedown = mousedown || {};

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
    update: function (el, binding) {
        el[ctx].methodName = binding.expression;
        el[ctx].bindingFn = binding.value;
    },
    unbind: function (el) {
        let len = nodeList.length;

        for (let i = 0; i < len; i++) {
            if (nodeList[i][ctx].id === el[ctx].id) {
                nodeList.splice(i, 1);
                break;
            }
        }
    }
});

window.app = new Vue({
    router: router,
    store: store
}).$mount('#app');
