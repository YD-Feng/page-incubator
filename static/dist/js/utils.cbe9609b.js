webpackJsonp([5],{

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(86);


/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468' : '') + week[this.getDay() + '']);
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
    }
    return fmt;
};

var pickerOptShortcuts = [{
    text: '00:00:00',
    onClick: function onClick(vm) {
        vm.userInputDate = vm.visibleDate || new Date().format(vm.dateFormat);
        vm.userInputTime = '00:00:00';
        vm.date = new Date(vm.userInputDate + ' 00:00:00');
        vm.value = vm.date;
        vm.emit(vm.date, vm.showTime);
    }
}, {
    text: '23:59:59',
    onClick: function onClick(vm) {
        vm.userInputDate = vm.visibleDate || new Date().format(vm.dateFormat);
        vm.userInputTime = '23:59:59';
        vm.date = new Date(vm.userInputDate + ' 23:59:59');
        vm.value = vm.date;
        vm.emit(vm.date, vm.showTime);
    }
}, {
    text: '10:00:00',
    onClick: function onClick(vm) {
        vm.userInputDate = vm.visibleDate || new Date().format(vm.dateFormat);
        vm.userInputTime = '10:00:00';
        vm.date = new Date(vm.userInputDate + ' 10:00:00');
        vm.value = vm.date;
        vm.emit(vm.date, vm.showTime);
    }
}, {
    text: '12:00:00',
    onClick: function onClick(vm) {
        vm.userInputDate = vm.visibleDate || new Date().format(vm.dateFormat);
        vm.userInputTime = '12:00:00';
        vm.date = new Date(vm.userInputDate + ' 12:00:00');
        vm.value = vm.date;
        vm.emit(vm.date, vm.showTime);
    }
}, {
    text: '14:00:00',
    onClick: function onClick(vm) {
        vm.userInputDate = vm.visibleDate || new Date().format(vm.dateFormat);
        vm.userInputTime = '14:00:00';
        vm.date = new Date(vm.userInputDate + ' 14:00:00');
        vm.value = vm.date;
        vm.emit(vm.date, vm.showTime);
    }
}, {
    text: '17:00:00',
    onClick: function onClick(vm) {
        vm.userInputDate = vm.visibleDate || new Date().format(vm.dateFormat);
        vm.userInputTime = '17:00:00';
        vm.date = new Date(vm.userInputDate + ' 17:00:00');
        vm.value = vm.date;
        vm.emit(vm.date, vm.showTime);
    }
}];

module.exports = {
    pickerOptShortcuts: pickerOptShortcuts
};

/***/ })

},[328]);