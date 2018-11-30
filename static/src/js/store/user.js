module.exports = {
    state: {
        userInfo: {
            user_id: '',
            user_name: '',
            group_id: '',
            nick_name: ''
        },
        userGroupList: []
    },
    mutations: {
        setUserInfo: function (state, userInfo) {
            state.userInfo = userInfo;
        },
        setUserGroupList: function (state, userGroupList) {
            state.userGroupList = userGroupList;
        }
    }
};
