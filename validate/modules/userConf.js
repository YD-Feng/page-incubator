module.exports = {
    changePassword: {
        old_password: 'required@旧密码',
        new_password: 'required@新密码'
    },
    add: {
        user_name: 'required@用户名',
        password: 'required@密码',
        group_id: 'required@用户分组',
        nick_name: 'required@用户昵称'
    },
    update: {
        user_id: 'required@用户ID',
        user_name: 'required@用户名'
    },
    del: {
        user_id: 'required@用户ID'
    },
    addUserGroup: {
        group_name: 'required@分组名称'
    },
    updateUserGroup: {
        group_id: 'required@分组ID',
        group_name: 'required@分组名称'
    },
    delUserGroup: {
        group_id: 'required@分组ID'
    }
};
