<template>
    <div class="home-page">
        <!-- 页头 -->
        <div class="header">
            <h1 class="title">
                <span class="text">
                    <i class="icon-font icon-xianxing_fuhua rel" style="font-size: 24px; top: 2px;"></i>
                    H5活动孵化器
                </span>
            </h1>

            <div class="fr pr15px f14px fBold">
                您好，{{userGroupData[userInfo.group_id] ? userGroupData[userInfo.group_id].group_name : ''}} - {{userInfo.nick_name}}
            </div>
        </div>

        <!-- 侧栏菜单 -->
        <ul class="menu" v-auto-height="{'delHeight': 90}">
            <el-tooltip effect="menu-tooltip" content="活动管理" placement="right">
                <li class="item"
                    @click="pageChange('/activityList')">
                    <i class="icon-font icon-plus-activity"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="用户管理" placement="right" v-if="userInfo.group_id == 1">
                <li class="item"
                    @click="pageChange('/userList')">
                    <i class="icon-font icon-yonghuguanli"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="修改密码" placement="right">
                <li class="item"
                    @click="openUserDialog">
                    <i class="icon-font icon-xiugaimima"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="退出登录" placement="right">
                <li class="item"
                    @click="logout">
                    <i class="icon-font icon-tuichu"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>
        </ul>

        <!-- 内容区 -->
        <div class="container">
            <div>
                <div class="container-inner" v-bar v-auto-height="{'delHeight': 94}">
                    <div>

                        <router-view></router-view>

                    </div>
                </div>
            </div>
        </div>

        <!-- 页脚 -->
        <div id="J-footer" class="footer">
            <i class="icon-chrome"></i>
            <span class="pl5px pr10px">为了保证运行效果，请用 Google Chrome 浏览器访问</span>
            <span class="pl10px pr10px">2018 © Powered By YD-Feng</span>
            <span class="pl10px">Email：550284209@qq.com</span>
        </div>

        <el-dialog
            :title="userDialog.title"
            :visible.sync="userDialog.visible"
            custom-class="home-dialog-300px">
            <div class="pl10px pr10px">
                <table width="100%">
                    <tr>
                        <td class="text-right pb10px">
                            旧 密 码：
                        </td>
                        <td class="pb10px">
                            <el-input
                                v-model.trim="userDialog.old_password"
                                placeholder="请输入旧密码"
                                class="form-input-width">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right pb10px">
                            新 密 码：
                        </td>
                        <td class="pb10px">
                            <el-input
                                type="password"
                                v-model="userDialog.new_password"
                                placeholder="请输入新密码"
                                class="form-input-width">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right pb10px">
                            确认密码：
                        </td>
                        <td class="pb10px">
                            <el-input
                                type="password"
                                v-model="userDialog.new_password_sp"
                                placeholder="请再次输入密码"
                                class="form-input-width">
                            </el-input>
                        </td>
                    </tr>
                </table>

                <div class="text-center pt10px">
                    <el-button
                        type="primary"
                        style="width: 60px;"
                        @click="handleSaveUser">
                        保存
                    </el-button>
                    <el-button
                        type="success"
                        style="width: 60px;"
                        @click="closeDialog">
                        取消
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Sha256 from 'js-sha256';

    module.exports = {
        data () {
            return {
                form: {
                    userName: '',
                    password: ''
                },
                flag: navigator.userAgent.toLowerCase().indexOf('webkit') != -1,

                userDialog: {
                    visible: false,
                    title: '修改密码',
                    old_password: '',
                    new_password: '',
                    new_password_sp: ''
                }
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.user.userInfo;
            },
            userGroupData () {
                var obj = {};

                this.$store.state.user.userGroupList.forEach(function (item) {
                    obj[item.group_id] = item;
                });

                return obj;
            }
        },
        methods: {
            logout () {
                var _this = this;

                _this.$get({
                    url: '/user/logout',
                    success: function (res) {
                        _this.$router.push({
                            path: '/login'
                        });
                    }
                });
            },

            getAreaList () {
                var _this = this;

                _this.$get({
                    url: '/area/getAreaList',
                    success: function (res) {
                        _this.$store.commit('setAreaList', res.data);
                    }
                });
            },

            getUserInfo () {
                var _this = this;

                _this.$get({
                    url: '/user/getUserInfo',
                    success: function (res) {
                        _this.$store.commit('setUserInfo', res.data);
                    }
                });
            },

            getUserGroupList () {
                var _this = this;

                _this.$get({
                    url: '/user/getUserGroupList',
                    success: function (res) {
                        _this.$store.commit('setUserGroupList', res.data);
                    }
                });
            },

            openUserDialog () {
                var _this = this;

                _this.userDialog.visible = true;
                _this.userDialog.old_password = '';
                _this.userDialog.new_password = '';
                _this.userDialog.new_password_sp = '';
            },
            closeDialog () {
                this.userDialog.visible = false;
            },
            handleSaveUser () {
                var _this = this;

                try {

                    if (_this.userDialog.old_password === '') {
                        throw {message: '旧密码不能为空'};
                    }

                    if (_this.userDialog.new_password === '') {
                        throw {message: '新密码不能为空'};
                    } else if (_this.userDialog.new_password.length > 20) {
                        throw {message: '密码最多只能输入20个字符'};
                    }

                    if (_this.userDialog.new_password_sp === '') {
                        throw {message: '确认密码不能为空'};
                    } else if (_this.userDialog.new_password !== _this.userDialog.new_password_sp) {
                        throw {message: '确认密码与新密码不一致'};
                    }

                    if (_this.userDialog.new_password === _this.userDialog.old_password) {
                        throw {message: '新旧密码不能相同'};
                    }

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                var param = {
                    old_password: Sha256(_this.userDialog.old_password),
                    new_password: Sha256(_this.userDialog.new_password)
                };

                _this.$post({
                    url: '/user/changePassword',
                    data: param,
                    success: function (res) {
                        _this.$message.success('密码修改成功，需要重新登录系统');
                        _this.logout();
                    }
                });
            },

            pageChange (path) {
                this.$router.push({
                    path: path
                });
            }
        },
        created () {
            var _this = this;
            _this.getAreaList();
            _this.getUserInfo();
            _this.getUserGroupList();
        }
    };
</script>

<style scoped>
    .form-input-width{
        width: 130px;
    }
</style>
<style>
    .home-dialog-300px{
        width: 300px;
    }
</style>
