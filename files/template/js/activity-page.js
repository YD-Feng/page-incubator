/**
 * Created by Riven on 2018/1/3.
 */

new Vue({
    el: '#J-app',
    data: function () {
        return {
            allMenuVisible: false,
            activityList: window.activityList,
            currentIndex: 0,
            isFixed: false,
            scroll: '',
            ulWidth: 0, // ul 宽度
            liList: null, // li 标签
            clsMenu: null,
            offsetTopList: [],
            flag: false,
            count: 0,
            swiperList: window.swiperList,
            index: 0,
            offsetLeft: 0,
            timer: null,
            moveX: 0,
            startX: 0,
            endOffset: 0,
            clientWidth: document.documentElement.clientWidth || document.body.clientWidth,
            isMove: true,
            entranceList: window.entranceList
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
        toggleAllMenu: function () {
            this.allMenuVisible = !this.allMenuVisible;
        },
        go: function () {
            var _this = this;
            _this.timer = setInterval(function () {
                _this.autoPlay()
            }, 2000);
        },
        stop: function () {
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
        start: function (e) {
            var _this = this;
            _this.stop();
            _this.startX = e.targetTouches[0].clientX;
        },
        move: function (e) {
            var _this = this;
            _this.isMove = false;
            _this.moveX = _this.startX - e.targetTouches[0].clientX;
            _this.offsetLeft = _this.endOffset - _this.moveX;
        },
        end: function (e) {
            var _this = this;
            if (_this.moveX) {
                e.preventDefault();
            }
            _this.go();
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
        init: function () {
            var _this = this;
            _this.activityList.forEach(function (item, index) {
                _this.getGoodsList(item.activityId, index);
            });
        },
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
                        _this.activityList[index].goodsList = res.goodsList;
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

                        _this.ulWidth = 0;
                        var arrDom = document.querySelectorAll('#menu ul li');
                        _this.liList = Array.prototype.slice.call(arrDom);
                        _this.clsMenu = document.querySelector('#menu .menu');
                        _this.liList.forEach(function (item) {
                            _this.ulWidth += item.clientWidth;
                        });
                        _this.ulWidth += 10;

                        _this.activityData.forEach(function (item, index) {
                            _this.offsetTopList.push(document.getElementById('id' + index).offsetTop - 0.8 * parseFloat(window.getComputedStyle(document.documentElement, null).fontSize));
                        });
                    });
                }
            });
        },
        toTitle: function (id, item, index) {
            var _this = this;

            _this.activityData.forEach(function (activityItem) {
                activityItem.flag = false;
            });
            item.flag = true;

            _this.currentIndex = index;

            // 获取当前宽度下的  html 字体大小
            var winFonfSize = parseFloat(window.getComputedStyle(document.documentElement, null).fontSize);

            document.body.scrollTop = document.getElementById(id).offsetTop - 0.7 * winFonfSize;
        },
        // 滚动事件
        eleScroll: function () {
            var _this = this;

            if (_this.activityData.length <= 1) {
                return;
            }

            var menuEle = document.getElementById('menu');
            _this.scroll = document.body.scrollTop;

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
                    _this.clsMenu.scrollLeft = _this.liList[_this.currentIndex].offsetLeft;
                } else {
                    _this.clsMenu.scrollLeft = _this.ulWidth - document.body.scrollWidth;
                }
            }

            _this.activityData[_this.currentIndex].flag = true;
        }
    },
    created: function () {
        var _this = this;

        //下面的代码在测试的时候会用到
        /*_this.$post({
            url: '/api/auth/token',
            data: {
                "isWeb": true,
                "loginPass": '123456',
                "loginName": '13112263404'
            },
            success: function (res) {
                _this.init();
            }
        });*/

        _this.init();
    },
    mounted: function () {
        // 绑定  滚动事件
        window.addEventListener('scroll', this.eleScroll);
        this.go();
    }


});
