module.exports = {
    state: {
        activityPage: {
            moduleType: {
                simple: '常规模块',
                floor: '活动楼层 - 平铺型',
                slideFloor: '活动楼层 - 横向滑动型',
                floorMenu: '活动楼层菜单',
                slideBanner: '滑动Banner'
            },
            linkType: {
                goods: 'APP - 商品详情',
                activity: 'APP - 活动列表页',
                packActivity: 'APP - 套装活动页',
                coupon: 'APP - 活动领取优惠券页',
                myCoupons: 'APP - 我的优惠券页',
                module: '跳转到当前活动页的某个模块',
                pageTop: '跳转到当前活动页的顶部',
                other: '其他跳转'
            },
            activityType: {
                promotion: '促销活动',
                bundle: '套装活动'
            }
        }
    },
    mutations: {
        setDict: function (state, dict) {
            state.dict = dict;
        }
    }
};
