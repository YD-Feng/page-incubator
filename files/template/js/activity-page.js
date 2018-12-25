new Vue({
    el: '#J-app',
    data: function () {
        return {
            activityList: window.activityList,
            count: 0,

            flag: false,
            scroll: '',
            isFixed: false,
            currentIndex: 0,

            menuEl: null,
            ulWidth: 0, // ul 宽度
            liList: null, // li 标签
            offsetTopList: [],
            allMenuVisible: false,

            swiperList: window.swiperList,
            timer: null,
            index: 0,
            offsetLeft: 0,
            moveX: 0,
            startX: 0,
            endOffset: 0,
            isMove: true,
            clientWidth: document.documentElement.clientWidth || document.body.clientWidth,

            modalMap: window.modalMap,
            maskVisible: false
        }
    },
    computed: {
        activityData: function () {
            return this.activityList.filter(function (item) {
                return !item.isHide;
            });
        }
    },
    methods: {
        init: function () {
            var _this = this;
            _this.activityList.forEach(function (item, index) {
                if (item.activityType == 'bundle') {
                    _this.getBundleList(item.activityId, index);
                } else {
                    _this.getGoodsList(item.activityId, index);
                }
            });
        },
        // 获取促销活动商品
        getGoodsList: function (activityId, index) {
            var _this = this;

            _this.$post({
                url: '/api/goods/v5/promotion?source=web',
                data: {
                    activityId: activityId,
                    limit: 20,
                    offset: 0
                },
                success: function (res) {
                    if (!res.goodsList || res.goodsList && res.goodsList.length == 0) {
                        _this.$set(_this.activityList[index], 'isHide', true);
                    } else {
                        _this.activityList[index].goodsList = res.goodsList.map(function (item) {
                            item.link = 'fmcgshop://goods/' + item.goodsId + '?isPresell=false';
                            return item;
                        });
                    }
                },
                error: function (res) {
                    _this.$set(_this.activityList[index], 'isHide', true);
                }
            }).then(function () {
                _this.count += 1;

                if (_this.count == _this.activityList.length) {
                    _this.flag = true;

                    _this.$nextTick(function () {
                        _this.offsetTopList = [];

                        _this.menuEl = document.querySelector('#menu .menu');
                        _this.ulWidth = 0;

                        var arrDom = document.querySelectorAll('#menu ul li');
                        _this.liList = Array.prototype.slice.call(arrDom);
                        _this.liList.forEach(function (item) {
                            _this.ulWidth += item.clientWidth;
                        });
                        _this.ulWidth += 10;

                        _this.activityData.forEach(function (item, index) {
                            _this.offsetTopList.push(document.getElementById('J-floor-' + index).offsetTop - 0.8 * parseFloat(window.getComputedStyle(document.documentElement, null).fontSize));
                        });
                    });
                }
            });
        },
        // 获取套装
        getBundleList: function (activityId, index) {
            var _this = this;

            _this.$get({
                url: '/api/promotion/bundleList/' + activityId,
                data: {
                    limit: 20,
                    offset: 0
                },
                success: function (res) {
                    if (!res.bundleList || res.bundleList && res.bundleList.length == 0) {
                        _this.$set(_this.activityList[index], 'isHide', true);
                    } else {
                        _this.activityList[index].goodsList = res.bundleList.map(function (item) {
                            item.thumb = item.picture;
                            item.link = 'fmcgshop://packActivity/' + item.activityId;
                            return item;
                        });
                    }
                },
                error: function (res) {
                    _this.$set(_this.activityList[index], 'isHide', true);
                }
            }).then(function () {
                _this.count += 1;

                if (_this.count == _this.activityList.length) {
                    _this.flag = true;

                    _this.$nextTick(function () {
                        _this.offsetTopList = [];

                        _this.menuEl = document.querySelector('#menu .menu');
                        _this.ulWidth = 0;

                        var arrDom = document.querySelectorAll('#menu ul li');
                        _this.liList = Array.prototype.slice.call(arrDom);
                        _this.liList.forEach(function (item) {
                            _this.ulWidth += item.clientWidth;
                        });
                        _this.ulWidth += 10;

                        _this.activityData.forEach(function (item, index) {
                            _this.offsetTopList.push(document.getElementById('J-floor-' + index).offsetTop - 0.8 * parseFloat(window.getComputedStyle(document.documentElement, null).fontSize));
                        });
                    });
                }
            })
        },

        toTitle: function (id, item, index) {
            var _this = this;

            _this.activityData.forEach(function (activityItem) {
                activityItem.flag = false;
            });
            item.flag = true;

            _this.currentIndex = index;

            // 获取当前宽度下的  html 字体大小
            var winFontSize = parseFloat(window.getComputedStyle(document.documentElement, null).fontSize);

            document.body.scrollTop = document.getElementById(id).offsetTop - 0.7 * winFontSize + 2;
            document.documentElement.scrollTop = document.getElementById(id).offsetTop - 0.7 * winFontSize + 2;
        },

        // 滚动事件
        eleScroll: function () {
            var _this = this;

            if (_this.activityData.length <= 1) {
                return;
            }

            var menuEle = document.getElementById('menu');
            _this.scroll = document.documentElement.scrollTop || document.body.scrollTop;

            if (_this.scroll >= menuEle.offsetTop) {
                _this.isFixed = true;
            } else {
                _this.isFixed = false;
            }

            _this.offsetTopList.forEach(function (item, index) {
                if (_this.scroll >= item) {
                    _this.currentIndex = index;
                }
            });

            _this.activityData.forEach(function (activityItem) {
                activityItem.flag = false;
            });

            if (_this.flag && _this.activityData.length > 3) {
                if ((_this.ulWidth - document.body.scrollWidth) >= _this.liList[_this.currentIndex].offsetLeft) {
                    _this.menuEl.scrollLeft = _this.liList[_this.currentIndex].offsetLeft;
                } else {
                    _this.menuEl.scrollLeft = _this.ulWidth - document.body.scrollWidth;
                }
            }

            _this.activityData[_this.currentIndex].flag = true;
        },

        playSwiper: function () {
            var _this = this;
            _this.timer = setInterval(function () {
                _this.autoPlay()
            }, 2000);
        },
        stopSwiper: function () {
            clearInterval(this.timer);
        },
        autoPlay: function () {
            var _this = this;

            _this.index = _this.index + 1;

            if (_this.index > _this.swiperList.length - 1) {
                _this.index = 0
            }

            _this.offsetLeft = -1 * _this.index * _this.clientWidth;
            _this.endOffset = _this.offsetLeft;
        },
        //左右切换
        switchSwiper (type) {
            var _this = this;

            _this.stopSwiper();

            if (type == 'prev') {
                _this.index = _this.index >= 1 ? _this.index - 1 : _this.swiperList.length - 1;
            }

            if (type == 'next' ) {
                _this.index =  _this.index <= _this.swiperList.length - 2 ? _this.index + 1 : 0;
            }

            _this.offsetLeft = -1 * _this.index * _this.clientWidth;
            _this.endOffset = _this.offsetLeft;

            _this.playSwiper();
        },
        handleTouchStart: function (e) {
            var _this = this;
            _this.stopSwiper();
            _this.startX = e.targetTouches[0].clientX;
        },
        handleTouchMove: function (e) {
            var _this = this;
            _this.isMove = false;
            _this.moveX = _this.startX - e.targetTouches[0].clientX;
            _this.offsetLeft = _this.endOffset - _this.moveX;
        },
        handleTouchEnd: function (e) {
            var _this = this;
            if (_this.moveX) {
                e.preventDefault();
            }
            _this.playSwiper();
            _this.isMove = true;

            if (_this.endOffset - _this.moveX > 0) {
                _this.offsetLeft = _this.endOffset;
                return;
            }

            if (_this.clientWidth * (_this.swiperList.length - 1) < -1 * _this.endOffset + _this.moveX) {
                _this.offsetLeft = _this.endOffset;
                return;
            }

            if (_this.moveX > 30) {
                _this.offsetLeft = _this.endOffset - _this.clientWidth;
                _this.endOffset = _this.offsetLeft;
                _this.index += 1;
            } else if (_this.moveX < -30) {
                _this.offsetLeft = _this.clientWidth + _this.endOffset;
                _this.endOffset = _this.offsetLeft;
                _this.index -= 1;
            } else {
                _this.offsetLeft = _this.endOffset;
            }

            _this.moveX = 0;
            _this.startX = 0;
        },

        toggleAllMenu: function () {
            this.allMenuVisible = !this.allMenuVisible;
        },

        openModal: function (index) {
            this.modalMap[index].visible = true;
            this.maskVisible = true;
        },

        closeModal: function () {
            var _this = this;
            for (var index in _this.modalMap) {
                _this.modalMap[index].visible = false;
            }
            _this.maskVisible = false;
        },

        // 打开小程序
        openMiniProgram: function (path) {
            var params = {
                path: path, // 'pages/chart/detail?lotteryId=1029'  指定页面 lotteryId=id  ID为后台列表上看到的id
                miniProgramType: 'release' // 小程序版本 release 正式; test 开发; preview 体验
            };

            this.launchMiniProgram(JSON.stringify(params));
        }
    },
    created: function () {
        var _this = this;

        if (location.href.indexOf('?test') != -1) {
            //测试模式
            var loginName = window.spCode.substring(0, 11),
                loginPass = window.spCode.substring(11);

            _this.$post({
                url: '/api/auth/token',
                data: {
                    isWeb: true,
                    loginPass: loginPass,
                    loginName: loginName
                },
                success: function (res) {
                    _this.init();
                }
            });
        } else {
            _this.init();
        }
    },
    mounted: function () {
        var _this = this;

        if (document.getElementById('menu')) {
            window.addEventListener('scroll', function () {
                _this.eleScroll();
            });
        }

        if (_this.swiperList.length > 0) {
            _this.playSwiper();
        }
    }
});
