<template>
    <div class="home-page">
        <!-- 页头 -->
        <div class="header">
            <h1 class="title">
                <i class="icon-font icon-buga"></i>
                <span class="text">
                    Bug Center
                </span>
            </h1>

            <div class="fr pr15px f14px fBold">
                您好，超级管理员 - admin
            </div>
        </div>

        <!-- 侧栏菜单 -->
        <ul class="menu" v-auto-height="{'delHeight': 90}">
            <el-tooltip effect="menu-tooltip" content="主页" placement="right">
                <li class="item">
                    <i class="icon-font icon-zhuye"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="项目" placement="right">
                <li class="item">
                    <i class="icon-font icon-project"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="统计" placement="right">
                <li class="item">
                    <i class="icon-font icon-tongji"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="组织" placement="right">
                <li class="item">
                    <i class="icon-font icon-zuzhi"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="修改密码" placement="right">
                <li class="item">
                    <i class="icon-font icon-xiugaimima"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>

            <el-tooltip effect="menu-tooltip" content="退出登录" placement="right">
                <li class="item">
                    <i class="icon-font icon-tuichu" @click="logout"></i>
                    <i class="light"></i>
                </li>
            </el-tooltip>
        </ul>

        <!-- 内容区 -->
        <div class="container">
            <div class="container-inner" v-bar v-auto-height="{'delHeight': 94}">
                <div class="p10px">

                    <router-view></router-view>

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
    </div>
</template>

<script>
    module.exports = {
        data: function () {
            return {
                form: {
                    userName: '',
                    password: ''
                },
                flag: navigator.userAgent.toLowerCase().indexOf('webkit') != -1
            }
        },
        methods: {
            logout: function () {
                var _this = this;

                _this.$get({
                    url: '/user/logout',
                    success: function (res) {
                        _this.$router.push({
                            path: '/login'
                        });
                    }
                })
            }
        }
    };
</script>
