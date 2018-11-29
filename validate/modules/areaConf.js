module.exports = {
    add: {
        area_name: 'required@区域名称',
        area_code: 'required@区域编码',
        test_user: 'required,custom[mobile]@测试账号',
        test_password: 'required@测试账号密码'
    },
    update: {
        area_id: 'required@区域ID',
        area_name: 'required@区域名称',
        area_code: 'required@区域编码',
        test_user: 'required,custom[mobile]@测试账号',
        test_password: 'required@测试账号密码'
    },
    del: {
        area_id: 'required@区域ID'
    }
};
