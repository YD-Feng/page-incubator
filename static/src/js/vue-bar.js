/*
* vue-bar —— Vue 模拟垂直方向滚动条自定义指令拓展
* 原版gitHub：https://github.com/DominikSerafin/vuebar
* 本版作者：YD-Feng
* 主要调整：注释本土化，修复了没生成模拟滚动条时，拖动内容会导致隐藏的原生滚动条显示出来的bug
* 注意：此指令只能模拟垂直滚动条，overflow-x 会被强制置为 hidden
* */
;(function(){
    'use strict';

    var VueBar = {
        install: function (Vue, options) {
            //创建 state 对象，将其挂载到使用指令元素上
            function createState (el) {
                el._vueBarState = {

                    //config 默认值
                    config: {
                        scrollThrottle: 10,
                        dragThrottle: 10,
                        resizeRefresh: true,
                        observerThrottle: 100,
                        resizeDeBounce: 100,
                        unSelectableBody: true,
                        overrideFloatingScrollBar: true, //是否覆盖悬浮滚动条（只有在移动设备上会出现悬浮滚动条）
                        scrollingPhantomDelay: 1000, //移除拖选样式（滚动条）的延迟时间
                        draggingPhantomDelay: 1000, //移除拖选样式（滚动条外壳）的延迟时间
                        preventParentScroll: false, //阻止父级元素滚动
                        useScrollBarPseudo: false, //使用 pseudo 样式选择器来处理原始滚动条隐藏的问题，只有 chrome 和 safari 浏览器支持

                        el1Class: 'vb',
                        el1ScrollVisibleClass: 'vb-visible',
                        el1ScrollInvisibleClass: 'vb-invisible',
                        el1ScrollingClass: 'vb-scrolling',
                        el1ScrollingPhantomClass: 'vb-scrolling-phantom',
                        el1DraggingClass: 'vb-dragging',
                        el1DraggingPhantomClass: 'vb-dragging-phantom',

                        el2Class: 'vb-content',

                        draggerClass: 'vb-dragger',
                        draggerStylerClass: 'vb-dragger-styler',
                        draggerClassX: 'vb-dragger-x',
                        draggerStylerClassX: 'vb-dragger-styler-x'
                    },

                    //缓存指令的 binding 对象
                    binding: null,

                    //缓存指令相关的dom元素
                    el1: null,
                    el2: null,
                    dragger: null,
                    draggerX: null,

                    //控制滚动条显隐
                    draggerEnabled: null,

                    visibleArea: 0, //内容可视部分占内容整体的比例，等于 1 表示全部可视（此时就无须显示滚动条），小于 1 表示部分可视（如 0.9 表示仅显示 90%，需要显示滚动条）
                    scrollTop: 0, //内容垂直方向滚动距离
                    barTop: 0, //滚动条样式 top 属性
                    barHeight: 0, //滚动条样式 height 属性
                    mouseBarOffsetY: 0, //鼠标点击滚动条时的 offsetY 值
                    barDragging: false, //滚动条是否正被拖动

                    visibleAreaX: 0,
                    scrollLeft: 0,
                    barLeft: 0,
                    barWidth: 0,
                    mouseBarOffsetX: 0,
                    barDraggingX: false,

                    //缓存变化监控器
                    mutationObserver: null,

                    //class变化计时器缓存
                    scrollingClassTimeout: null,
                    draggingClassTimeout: null,
                    scrollingPhantomClassTimeout: null,
                    draggingPhantomClassTimeout: null,

                    //缓存事件回调函数，移除事件的时候必须用到它作为传参，所以缓存起来
                    barMousedown: null,
                    barMousedownX: null,
                    documentMousemove: null,
                    documentMouseup: null,
                    windowResize: null,
                    scrollHandler: null,
                    wheelHandler: null
                };

                return el._vueBarState;
            }

            //获取 state 对象
            function getState (el) {
                return el._vueBarState;
            }

            //指令场景校验
            function markupValidation (el) {
                if (!el.firstChild) {
                    console.warn('v-bar指令绑定元素没包含任何内容（子元素）');
                    return false;
                }
                return true;
            }

            //计算内容可视部分占内容整体的比例
            function computeVisibleArea (el) {
                var state = getState(el);
                state.visibleArea = (state.el2.clientHeight / state.el2.scrollHeight);
            }
            function computeVisibleAreaX (el) {
                var state = getState(el);
                state.visibleAreaX = (state.el2.clientWidth / state.el2.scrollWidth);
            }

            //计算 scrollTop
            function computeScrollTop (el) {
                var state = getState(el);
                state.scrollTop = state.barTop * (state.el2.scrollHeight / state.el2.clientHeight);
            }
            function computeScrollLeft (el) {
                var state = getState(el);
                state.scrollLeft = state.barLeft * (state.el2.scrollWidth / state.el2.clientWidth);
            }

            //计算 barTop
            function computeBarTop (el, event) {
                var state = getState(el);

                if (!event) {
                    //如果不是通过鼠标移动事件回调触发执行...
                    state.barTop = state.el2.scrollTop * state.visibleArea;
                    return false;
                } else {
                    //如果通过鼠标移动事件回调触发执行...
                    var relativeMouseY = (event.clientY - state.el1.getBoundingClientRect().top);

                    if (relativeMouseY <= state.mouseBarOffsetY) {
                        state.barTop = 0;
                    }

                    if (relativeMouseY > state.mouseBarOffsetY) {
                        state.barTop = relativeMouseY - state.mouseBarOffsetY;
                    }

                    if ( (state.barTop + state.barHeight ) >= state.el2.clientHeight ) {
                        state.barTop = state.el2.clientHeight - state.barHeight;
                    }
                }
            }
            function computeBarLeft (el, event) {
                var state = getState(el);

                if (!event) {
                    //如果不是通过鼠标移动事件回调触发执行...
                    state.barLeft = state.el2.scrollLeft * state.visibleAreaX;
                    return false;
                } else {
                    //如果通过鼠标移动事件回调触发执行...
                    var relativeMouseY = (event.clientX - state.el1.getBoundingClientRect().left);

                    if (relativeMouseY <= state.mouseBarOffsetX) {
                        state.barLeft = 0;
                    }

                    if (relativeMouseY > state.mouseBarOffsetX) {
                        state.barLeft = relativeMouseY - state.mouseBarOffsetX;
                    }

                    if ( (state.barLeft + state.barWidth ) >= state.el2.clientWidth ) {
                        state.barLeft = state.el2.clientWidth - state.barWidth;
                    }
                }
            }

            //计算滚动条高度
            function computeBarHeight (el) {
                var state = getState(el);
                if (state.visibleArea >= 1) {
                    state.barHeight = 0;
                } else {
                    state.barHeight = state.el2.clientHeight * state.visibleArea;
                }
            }
            function computeBarWidth (el) {
                var state = getState(el);
                if (state.visibleAreaX >= 1) {
                    state.barWidth = 0;
                } else {
                    state.barWidth = state.el2.clientWidth * state.visibleAreaX;
                }
            }

            //生成模拟滚动条
            function createDragger (el, flag) {
                var state = getState(el),
                    dragger = document.createElement('div'),
                    draggerStyler = document.createElement('div');

                dragger.className = flag ? state.config.draggerClassX : state.config.draggerClass;
                dragger.style.position = 'absolute';
                if (!state.draggerEnabled) {
                    dragger.style.display = 'none';
                }

                draggerStyler.className = flag ? state.config.draggerStylerClassX : state.config.draggerStylerClass;

                dragger.appendChild(draggerStyler);
                state.el1.appendChild(dragger);

                return dragger;
            }

            //更新模拟滚动条样式状态
            function updateDragger (el, options) {
                var options = options ? options : {},
                    state = getState(el);

                state.dragger.style.height = parseInt( Math.round( state.barHeight ) ) + 'px';
                state.dragger.style.top = parseInt( Math.round( state.barTop ) ) + 'px';

                if (state.draggerEnabled && (state.visibleArea < 1)) {
                    //显示模拟滚动条
                    removeClass(state.el1, state.config.el1ScrollInvisibleClass);
                    addClass(state.el1, state.config.el1ScrollVisibleClass);
                    state.el2.style.overflowY = 'scroll';
                    state.el2.style.maxWidth = 'none';
                } else {
                    //隐藏模拟滚动条
                    removeClass(state.el1, state.config.el1ScrollVisibleClass);
                    addClass(state.el1, state.config.el1ScrollInvisibleClass);
                    state.el2.style.overflowY = 'hidden';
                    state.el2.style.maxWidth = '100%';
                }

                //横向滚动条相关
                state.draggerX.style.width = parseInt( Math.round( state.barWidth ) ) + 'px';
                state.draggerX.style.left = parseInt( Math.round( state.barLeft ) ) + 'px';

                if (state.draggerEnabled && (state.visibleAreaX < 1)) {
                    //显示模拟滚动条
                    removeClass(state.el1, state.config.el1ScrollInvisibleClass);
                    addClass(state.el1, state.config.el1ScrollVisibleClass);
                    state.el2.style.overflowX = 'scroll';
                    state.el2.style.maxHeight = 'none';
                } else {
                    //隐藏模拟滚动条
                    removeClass(state.el1, state.config.el1ScrollVisibleClass);
                    addClass(state.el1, state.config.el1ScrollInvisibleClass);
                    state.el2.style.overflowX = 'hidden';
                    state.el2.style.maxHeight = '100%';
                }
                //横向滚动条相关 end

                if (options.withScrollingClasses) {
                    //模拟滚动条添加【滚动中】样式 class
                    addClass(state.el1, state.config.el1ScrollingClass);

                    //在一定时间后，模拟滚动条自动移除【滚动中】样式 class
                    state.scrollingClassTimeout ? clearTimeout(state.scrollingClassTimeout) : null;
                    state.scrollingClassTimeout = setTimeout(function () {
                        removeClass(state.el1, state.config.el1ScrollingClass);
                    }, state.config.scrollThrottle + 5);


                    //模拟滚动条外壳容器添加【滚动中】样式 class
                    addClass(state.el1, state.config.el1ScrollingPhantomClass);

                    //在一定时间后，模拟滚动条外壳容器自动移除【滚动中】样式 class
                    state.scrollingPhantomClassTimeout ? clearTimeout(state.scrollingPhantomClassTimeout) : null;
                    state.scrollingPhantomClassTimeout = setTimeout(function () {
                        removeClass(state.el1, state.config.el1ScrollingPhantomClass);
                    }, state.config.scrollThrottle + state.config.scrollingPhantomDelay);

                }
            }

            // 使用 pseudo 样式选择器来处理原始滚动条隐藏的问题，只有 chrome 和 safari 浏览器支持
            function hideScrollbarUsingPseudoElement (el) {
                var state = getState(el),
                    idName = 'vuebar-pseudo-element-styles',
                    selector = '.' + state.config.el2Class + '::-webkit-scrollbar',
                    styleElm = document.getElementById(idName),
                    sheet = null,
                    ruleExists = false;

                if (styleElm) {
                    sheet = styleElm.sheet;
                } else {
                    styleElm = document.createElement('style');
                    styleElm.id = idName;
                    document.head.appendChild(styleElm);
                    sheet = styleElm.sheet;
                }

                for (var i = 0, l = sheet.rules.length; i < l; i++) {
                    var rule = sheet.rules[i];
                    if (rule.selectorText == selector) {
                        ruleExists = true;
                    }
                }

                if ( ruleExists ) {
                    return false;
                }

                if (sheet.insertRule) {
                    sheet.insertRule(selector + '{display:none}', 0);
                }
            }

            //阻止父级元素滚动
            function preventParentScroll (el, event) {
                var state = getState(el);

                if (state.visibleArea >= 1) {
                    return false;
                }

                var scrollDist = state.el2.scrollHeight - state.el2.clientHeight,
                    scrollTop = state.el2.scrollTop,
                    wheelingUp = event.deltaY < 0,
                    wheelingDown = event.deltaY > 0;

                if ( (scrollTop <= 0) && wheelingUp) {
                    event.preventDefault();
                    return false;
                }

                if ( (scrollTop >= scrollDist) && wheelingDown) {
                    event.preventDefault();
                    return false;
                }
            }

            //滚动内容
            function updateScroll (el) {
                var state = getState(el);
                state.el2.scrollTop = state.scrollTop;
                state.el2.scrollLeft = state.scrollLeft;
            }

            //刷新滚动条
            function refreshScrollbar (el, options) {
                var options = options ? options : {};

                if (options.immediate) {
                    computeVisibleArea(el);
                    computeBarTop(el);
                    computeBarHeight(el);
                    computeVisibleAreaX(el);
                    computeBarLeft(el);
                    computeBarWidth(el);
                    updateDragger(el);
                }

                Vue.nextTick(function () {
                    if ( !getState(el) ) {
                        return false;
                    }
                    computeVisibleArea(el);
                    computeBarTop(el);
                    computeBarHeight(el);
                    computeVisibleAreaX(el);
                    computeBarLeft(el);
                    computeBarWidth(el);
                    updateDragger(el);
                }.bind(this));
            }


            //事件绑定
            function scrollHandler (el) {
                var state = getState(el);
                return throttle(function (event) {
                    computeVisibleArea(el);
                    computeVisibleAreaX(el);
                    computeBarHeight(el);
                    computeBarWidth(el);

                    if (!state.barDragging) {
                        computeBarTop(el);
                        updateDragger(el, {
                            withScrollingClasses: true
                        });
                    }

                    if (!state.barDraggingX) {
                        computeBarLeft(el);
                        updateDragger(el, {
                            withScrollingClasses: true
                        });
                    }
                }.bind(this), state.config.scrollThrottle);
            }

            function wheelHandler (el) {
                return function (event) {
                    preventParentScroll(el, event);
                }.bind(this);
            }

            function documentMousemove (el) {
                var state = getState(el);
                return throttle(function (event) {
                    if (state.barDragging) {
                        computeBarTop(el, event);
                        updateDragger(el);
                        computeScrollTop(el);
                        updateScroll(el);
                    }

                    if (state.barDraggingX) {
                        computeBarLeft(el, event);
                        updateDragger(el);
                        computeScrollLeft(el);
                        updateScroll(el);
                    }
                }.bind(this), state.config.dragThrottle);
            }

            function documentMouseup (el) {
                var state = getState(el);

                return function (event) {
                    state.barDragging = false;
                    state.barDraggingX = false;

                    //设置是可以拖选
                    state.el1.style.userSelect = '';
                    state.config.unSelectableBody ? compatStyle(document.body, 'UserSelect', '') : null;

                    //移除拖动滚动条样式 class
                    removeClass(state.el1, state.config.el1DraggingClass);
                    state.draggingPhantomClassTimeout = setTimeout(function () {
                        removeClass(state.el1, state.config.el1DraggingPhantomClass);
                    }, state.config.draggingPhantomDelay);

                    document.removeEventListener('mousemove', state.documentMousemove, 0);
                    document.removeEventListener('mouseup', state.documentMouseup, 0);
                }.bind(this);
            }


            function barMousedown (el) {
                var state = getState(el);

                return function (event) {
                    console.info('aaa');
                    //如果不是点击鼠标左键，不做任何事
                    if ( event.which !== 1 ) {
                        return false
                    }

                    state.barDragging = true;
                    state.mouseBarOffsetY = event.offsetY;

                    //设置不可拖选
                    state.el1.style.userSelect = 'none';
                    state.config.unSelectableBody ? compatStyle(document.body, 'UserSelect', 'none') : null;

                    //添加拖动滚动条样式 class
                    addClass(state.el1, state.config.el1DraggingClass);
                    state.draggingPhantomClassTimeout ? clearTimeout(state.draggingPhantomClassTimeout) : null;
                    addClass(state.el1, state.config.el1DraggingPhantomClass);

                    document.addEventListener('mousemove', state.documentMousemove, 0);
                    document.addEventListener('mouseup', state.documentMouseup, 0);
                }.bind(this);
            }

            function barMousedownX (el) {
                var state = getState(el);

                return function (event) {
                    console.info('bbb');
                    //如果不是点击鼠标左键，不做任何事
                    if ( event.which !== 1 ) {
                        return false
                    }

                    state.barDraggingX = true;
                    state.mouseBarOffsetX = event.offsetX;

                    //设置不可拖选
                    state.el1.style.userSelect = 'none';
                    state.config.unSelectableBody ? compatStyle(document.body, 'UserSelect', 'none') : null;

                    //添加拖动滚动条样式 class
                    addClass(state.el1, state.config.el1DraggingClass);
                    state.draggingPhantomClassTimeout ? clearTimeout(state.draggingPhantomClassTimeout) : null;
                    addClass(state.el1, state.config.el1DraggingPhantomClass);

                    document.addEventListener('mousemove', state.documentMousemove, 0);
                    document.addEventListener('mouseup', state.documentMouseup, 0);
                }.bind(this);
            }

            function windowResize (el) {
                var state = getState(el);

                return debounce(function (event) {
                    refreshScrollbar(el);
                }.bind(this), state.config.resizeDeBounce);
            }

            //创建变化监控器(H5新特性) —— 当DOM对象树发生任何变动时，变化监控器会发送通知
            function initMutationObserver (el) {
                if (typeof MutationObserver === typeof void 0) {
                    return null;
                }

                var state = getState(el),
                    observer = new MutationObserver(throttle(function (mutations) {
                        refreshScrollbar(el);
                    }, state.config.observerThrottle));

                observer.observe(state.el2, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });

                return observer;
            }

            //初始化模拟滚动条
            function initScrollbar (el, kwargs) {

                //指令场景校验
                if ( !markupValidation.call(this, el) ) {
                    return false;
                }

                //防止滚动条多次初始化
                if (el._vueBarState) {
                    Vue.util.warn('v-bar模拟滚动条指令被多次初始化');
                    return false;
                }

                //创建 state 对象，将其挂载到使用指令元素上
                var state = createState(el);

                //获取用户指定配置，如果用户没指定任何配置项，则使用默认值
                var options = kwargs.value ? kwargs.value : (kwargs ? kwargs : {});

                //设置配置项
                for (var key in options){
                    state.config[key] = options[key];
                }

                //检测浏览器
                var browser = detectBrowser(),
                    elNativeScrollbarWidth = getNativeScrollbarWidth(el.firstElementChild),
                    overlayScrollbar = elNativeScrollbarWidth == 0;

                state.draggerEnabled = ( (!overlayScrollbar) || state.config.overrideFloatingScrollBar ) ? 1 : 0;

                //缓存关键对象
                state.binding = kwargs.value ? kwargs : null;
                state.el1 = el;
                state.el2 = el.firstElementChild;
                state.dragger = createDragger(el);
                state.draggerX = createDragger(el, true);

                //绑定事件并缓存事件回调函数
                state.barMousedown = barMousedown(el);
                state.barMousedownX = barMousedownX(el);
                state.documentMousemove = documentMousemove(el);
                state.documentMouseup = documentMouseup(el);
                state.windowResize = windowResize(el);
                state.scrollHandler = scrollHandler(el);
                state.wheelHandler = wheelHandler(el);

                //创建变化监控器
                state.mutationObserver = initMutationObserver(el);

                //添加样式
                addClass(state.el1, state.config.el1Class);
                state.el1.style.position = 'relative';
                state.el1.style.overflow = 'hidden';

                addClass(state.el2, state.config.el2Class);
                state.el2.style.display = 'block';
                state.el2.style.overflowX = 'scroll';
                state.el2.style.overflowY = 'scroll';
                state.el2.style.height = '100%';

                if (state.draggerEnabled) {

                    if ( state.config.useScrollBarPseudo && (browser.chrome || browser.safari) ) {
                        //使用 pseudo 样式选择器来处理原始滚动条隐藏的问题，只有 chrome 和 safari 浏览器支持
                        state.el2.style.width = '100%';
                        hideScrollbarUsingPseudoElement(el);
                    } else if (overlayScrollbar) {
                        //如果浏览器默认滚动条是悬浮滚动条（也就是不占宽度）
                        state.el2.style.width = '100%';
                        compatStyle(state.el2, 'BoxSizing', 'content-box');
                        state.el2.style.paddingRight = '20px';
                        state.el2.style.paddingBottom = '20px';
                    } else {
                        //如果浏览器默认滚动条是常规滚动条（有宽度）
                        state.el2.style.width = 'calc(100% + ' + elNativeScrollbarWidth + 'px)';
                        state.el2.style.height = 'calc(100% + ' + elNativeScrollbarWidth + 'px)';
                    }
                }

                //绑定事件
                state.el2.addEventListener('scroll', state.scrollHandler, 0);
                state.dragger.addEventListener('mousedown', state.barMousedown, 0);
                state.draggerX.addEventListener('mousedown', state.barMousedownX, 0);
                state.config.preventParentScroll ? state.el2.addEventListener('wheel', state.wheelHandler, 0) : null;
                state.config.resizeRefresh ? window.addEventListener('resize', state.windowResize, 0) : null;

                //刷新滚动条
                refreshScrollbar(el, {
                    immediate: true
                });
            }

            //销毁模拟滚动条
            function destroyScrollbar (el, options) {
                var options = options ? options : {},
                    state = getState(el);

                //移除事件绑定
                state.dragger.removeEventListener('mousedown', state.barMousedown, 0);
                state.el2.removeEventListener('scroll', state.scrollHandler, 0);
                state.el2.removeEventListener('wheel', state.scrollHandler, 0);
                window.removeEventListener('resize', state.windowResize, 0);

                //销毁变化监控器
                state.mutationObserver ? state.mutationObserver.disconnect() : null;

                //清空样式
                removeClass(state.el1, state.config.el1Class);
                removeClass(state.el1, state.config.el1ScrollVisibleClass);
                removeClass(state.el1, state.config.el1ScrollInvisibleClass);
                removeClass(state.el1, state.config.el1ScrollingClass);
                removeClass(state.el1, state.config.el1ScrollingPhantomClass);
                removeClass(state.el1, state.config.el1DraggingClass);

                if (options.clearStyles) {
                    state.el1.style.position = '';
                    state.el1.style.overflow = '';
                }

                removeClass(state.el2, state.config.el2Class);

                if (options.clearStyles) {
                    state.el2.style.display = '';
                    state.el2.style.overflowX = '';
                    state.el2.style.overflowY = '';
                    state.el2.style.msOverflowStyle = '';
                    state.el2.style.height = '';
                    state.el2.style.width = '';
                }

                //移除模拟滚动条
                state.dragger.removeChild(state.dragger.firstChild);
                state.el1.removeChild(state.dragger);

                //移除计时器
                state.scrollingPhantomClassTimeout ? clearTimeout(state.scrollingPhantomClassTimeout) : null;
                state.draggingPhantomClassTimeout ? clearTimeout(state.draggingPhantomClassTimeout) : null;

                //移除挂载在 dom 元素上的 state 对象
                delete el._vueBarState;
            }

            //放抖动处理函数
            function debounce (fn, delay) {
                var timer = null;
                return function () {
                    var context = this,
                        args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                    }, delay);
                };
            }

            //函数执行频率控制处理函数
            function throttle (fn, threshhold, scope) {
                threshhold || (threshhold = 250);

                var last,
                    deferTimer;

                return function () {
                    var context = scope || this,
                        now = +new Date,
                        args = arguments;

                    if (last && now < last + threshhold) {
                        clearTimeout(deferTimer);
                        deferTimer = setTimeout(function () {
                            last = now;
                            fn.apply(context, args);
                        }, threshhold);
                    } else {
                        last = now;
                        fn.apply(context, args);
                    }
                }
            }

            //样式属性前缀兼容处理函数
            function compatStyle (element, property, value) {
                element.style['webkit' + property] = value;
                element.style['moz' + property] = value;
                element.style['ms' + property] = value;
                element.style['o' + property] = value;
                element.style[ property.slice(0,1).toLowerCase() + property.substring(1) ] = value;
            }

            //判断元素是否包含某个class
            function hasClass (el, className) {
                return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className);
            }

            //为元素添加某个class
            function addClass (el, className) {
                if (el.classList) el.classList.add(className);
                else if (!hasClass(el, className)) el.className += ' ' + className;
            }

            //为元素移除某个class
            function removeClass (el, className) {
                if (el.classList) el.classList.remove(className);
                else el.className = el.className.replace(new RegExp('\\b'+ className+'\\b', 'g'), '');
            }

            //浏览器检测函数
            function detectBrowser () {
                //获取IE版本
                function getIEVersion() {
                    var match = window.navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
                    return match ? parseInt(match[1]) : void 0;
                }

                var ua = window.navigator.userAgent,
                    vendor = window.navigator.vendor,
                    chrome = ( (ua.toLowerCase().indexOf('chrome') > -1) && (vendor.toLowerCase().indexOf('google') > -1) ),
                    edge = ua.indexOf('Edge') > -1,
                    safari = !!window.safari || ((ua.toLowerCase().indexOf('safari') > -1) && (vendor.toLowerCase().indexOf('apple') > -1)),
                    ie8 = getIEVersion() == 8,
                    ie9 = getIEVersion() == 9,
                    ie10 = getIEVersion() == 10,
                    ie11 = getIEVersion() == 11,
                    ie = ie8 || ie9 || ie10 || ie11,
                    uaOrVendor = ua || vendor || window.opera,
                    mobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(uaOrVendor)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(uaOrVendor.substr(0,4)));

                return {
                    edge: edge,
                    chrome: chrome,
                    safari: safari,
                    mobile: mobile,
                    ie: ie,
                    ie8: ie8,
                    ie9: ie9,
                    ie10: ie10,
                    ie11: ie11
                };
            }

            //获取浏览器默认滚动条的宽度
            function getNativeScrollbarWidth (container) {
                var container = container ? container : document.body,
                    fullWidth = 0,
                    barWidth = 0,
                    wrapper = document.createElement('div'),
                    child = document.createElement('div');

                wrapper.style.position = 'absolute';
                wrapper.style.pointerEvents = 'none';
                wrapper.style.bottom = '0';
                wrapper.style.right = '0';
                wrapper.style.width = '100px';
                wrapper.style.overflow = 'hidden';

                wrapper.appendChild(child);
                container.appendChild(wrapper);

                fullWidth = child.offsetWidth;
                wrapper.style.overflowY = 'scroll';
                barWidth = fullWidth - child.offsetWidth;

                container.removeChild(wrapper);

                return barWidth;
            }

            //注入公共方法
            function publicMethods () {
                return {
                    getState: getState,
                    initScrollbar: initScrollbar,
                    destroyScrollbar: destroyScrollbar,
                    refreshScrollbar: refreshScrollbar
                };
            }
            Vue.vuebar = publicMethods();
            Vue.prototype.$vuebar = publicMethods();

            //自定义指令
            Vue.directive('bar', {
                inserted: function (el, binding, vnode) {
                    initScrollbar.call(this, el, binding);
                },
                componentUpdated: function (el, binding, vnode, oldVnode) {
                    refreshScrollbar.call(this, el);
                },
                unbind: function (el, binding, vnode, oldVnode) {
                    destroyScrollbar.call(this, el, {clearStyles: false});
                }
            });
        }
    };

    //暴露对象 / 自动引入指令
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = VueBar;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return VueBar;
        });
    } else if (typeof window !== typeof void 0) {
        window.VueBar = VueBar;
    }

    if (typeof Vue !== typeof void 0) {
        Vue.use(VueBar);
    }
})();
