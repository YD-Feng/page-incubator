module.exports = {
    getActivityPageList: {
        activity_id: 'required@活动ID'
    },
    add: {
        activity_id: 'required@活动ID',
        area_id: 'required@区域ID'
    },
    update: {
        page_id: 'required@活动页面ID',
        setting: 'required@活动页面设置',
    },
    del: {
        page_id: 'required@活动页面ID'
    },
    export: {
        activity_id: 'required@活动ID'
    }
};
