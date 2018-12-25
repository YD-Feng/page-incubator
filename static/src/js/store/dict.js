module.exports = {
    state: {
        activityPage: {
            moduleType: {
                simple: '常规模块',
                floor: '活动楼层',
                floorMenu: '活动楼层菜单',
                slideBanner: '滑动Banner',
                modal: '页面弹窗',
                fixedBox: '悬浮窗'
            },
            floorType: {
                simple: '常规三列型',
                slide: '横向滑动型',
                twoCol: '双列型'
            },
            titleImgPosition: {
                top: '楼层顶部',
                in: '占用楼层商品位'
            },
            linkType: {
                goods: 'APP - 商品详情',
                activity: 'APP - 活动列表页',
                packActivity: 'APP - 套装活动页',
                coupon: 'APP - 活动领取优惠券页',
                myCoupons: 'APP - 我的优惠券页',
                module: '跳转到当前活动页的某个模块',
                floor: '跳转到楼层模块的某个楼层',
                smallProgram: '跳转到小程序',
                pageTop: '跳转到当前活动页的顶部',
                modalOpen: '打开页面弹窗',
                modalClose: '关闭页面弹窗',
                other: '其他跳转'
            },
            activityType: {
                promotion: '促销活动',
                bundle: '套装活动'
            },
            smallProgram: {
                welfareAgency: '店友福利社'
            },
            bannerSwitchEffect: {
                slide: '平移',
                none: '无'
            }
        }
    },
    mutations: {
        setDict: function (state, dict) {
            state.dict = dict;
        }
    }
};
