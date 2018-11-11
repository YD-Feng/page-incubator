webpackJsonp([2],{

/***/ 147:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var Component = __webpack_require__(330)(
  /* script */
  __webpack_require__(336),
  /* template */
  __webpack_require__(343),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)
Component.options.__file = "D:\\code\\@page-incubator\\static\\src\\views\\main.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] main.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e29f6830", Component.options)
  } else {
    hotAPI.reload("data-v-e29f6830", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 330:
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

module.exports = {
    data: function data() {
        return {
            form: {
                userName: '',
                password: ''
            },
            flag: navigator.userAgent.toLowerCase().indexOf('webkit') != -1
        };
    },
    methods: {
        logout: function logout() {
            var _this = this;

            _this.$get({
                url: '/user/logout',
                success: function success(res) {
                    _this.$router.push({
                        path: '/login'
                    });
                }
            });
        }
    }
};

/***/ }),

/***/ 343:
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "home-page"
  }, [_vm._m(0), _vm._v(" "), _c('ul', {
    directives: [{
      name: "auto-height",
      rawName: "v-auto-height",
      value: ({
        'delHeight': 90
      }),
      expression: "{'delHeight': 90}"
    }],
    staticClass: "menu"
  }, [_c('el-tooltip', {
    attrs: {
      "effect": "menu-tooltip",
      "content": "主页",
      "placement": "right"
    }
  }, [_c('li', {
    staticClass: "item"
  }, [_c('i', {
    staticClass: "icon-font icon-zhuye"
  }), _vm._v(" "), _c('i', {
    staticClass: "light"
  })])]), _vm._v(" "), _c('el-tooltip', {
    attrs: {
      "effect": "menu-tooltip",
      "content": "项目",
      "placement": "right"
    }
  }, [_c('li', {
    staticClass: "item"
  }, [_c('i', {
    staticClass: "icon-font icon-project"
  }), _vm._v(" "), _c('i', {
    staticClass: "light"
  })])]), _vm._v(" "), _c('el-tooltip', {
    attrs: {
      "effect": "menu-tooltip",
      "content": "统计",
      "placement": "right"
    }
  }, [_c('li', {
    staticClass: "item"
  }, [_c('i', {
    staticClass: "icon-font icon-tongji"
  }), _vm._v(" "), _c('i', {
    staticClass: "light"
  })])]), _vm._v(" "), _c('el-tooltip', {
    attrs: {
      "effect": "menu-tooltip",
      "content": "组织",
      "placement": "right"
    }
  }, [_c('li', {
    staticClass: "item"
  }, [_c('i', {
    staticClass: "icon-font icon-zuzhi"
  }), _vm._v(" "), _c('i', {
    staticClass: "light"
  })])]), _vm._v(" "), _c('el-tooltip', {
    attrs: {
      "effect": "menu-tooltip",
      "content": "修改密码",
      "placement": "right"
    }
  }, [_c('li', {
    staticClass: "item"
  }, [_c('i', {
    staticClass: "icon-font icon-xiugaimima"
  }), _vm._v(" "), _c('i', {
    staticClass: "light"
  })])]), _vm._v(" "), _c('el-tooltip', {
    attrs: {
      "effect": "menu-tooltip",
      "content": "退出登录",
      "placement": "right"
    }
  }, [_c('li', {
    staticClass: "item"
  }, [_c('i', {
    staticClass: "icon-font icon-tuichu",
    on: {
      "click": _vm.logout
    }
  }), _vm._v(" "), _c('i', {
    staticClass: "light"
  })])])], 1), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, [_c('div', {
    directives: [{
      name: "bar",
      rawName: "v-bar"
    }, {
      name: "auto-height",
      rawName: "v-auto-height",
      value: ({
        'delHeight': 94
      }),
      expression: "{'delHeight': 94}"
    }],
    staticClass: "container-inner"
  }, [_c('div', {
    staticClass: "p10px"
  }, [_c('router-view')], 1)])]), _vm._v(" "), _vm._m(1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "header"
  }, [_c('h1', {
    staticClass: "title"
  }, [_c('i', {
    staticClass: "icon-font icon-buga"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("\n                H5活动孵化器\n            ")])]), _vm._v(" "), _c('div', {
    staticClass: "fr pr15px f14px fBold"
  }, [_vm._v("\n            您好，超级管理员 - admin\n        ")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "footer",
    attrs: {
      "id": "J-footer"
    }
  }, [_c('i', {
    staticClass: "icon-chrome"
  }), _vm._v(" "), _c('span', {
    staticClass: "pl5px pr10px"
  }, [_vm._v("为了保证运行效果，请用 Google Chrome 浏览器访问")]), _vm._v(" "), _c('span', {
    staticClass: "pl10px pr10px"
  }, [_vm._v("2018 © Powered By YD-Feng")]), _vm._v(" "), _c('span', {
    staticClass: "pl10px"
  }, [_vm._v("Email：550284209@qq.com")])])
}]}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-e29f6830", module.exports)
  }
}

/***/ })

});