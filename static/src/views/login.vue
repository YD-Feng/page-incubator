<template>
    <div class="login-wrap" v-auto-height>
        <form class="login-form" ref="form" @submit="login">
            <h2 class="title">H5活动孵化器</h2>
            <div class="input-wrap">
                <span class="col-txt">用户名:</span>
                <span class="col-input">
                    <input class="input" v-model.trim="form.user_name" placeholder="请输入用户邮箱"></input>
                </span>
            </div>
            <div class="input-wrap mt20px">
                <span class="col-txt">密　码:</span>
                <span class="col-input">
                    <input class="input" type="password" v-model.trim="form.password" placeholder="请输入用户密码"></input>
                </span>
            </div>
            <div class="mt20px">
                <button class="btn" @click="login">登　录</button>
            </div>
        </form>

        <div class="header-box">
            {{flag ? '不错嘛，你的浏览器是 webkit 内核的，访问本平台应该没任何毛病，请放心使用~' : '你的浏览器不是 webkit 内核的，都什么年代了，赶紧换个浏览器吧，不要这么 low 啦~'}}
        </div>
        <div class="footer-box">
            <i class="icon-chrome"></i>
            <span class="pl5px pr10px">为了保证运行效果，请用 Google Chrome 浏览器访问</span>
            <span class="pl10px pr10px">2018 © Powered By YD-Feng</span>
            <span class="pl10px">Email：550284209@qq.com</span>
        </div>

        <div></div>
        <div class="circle circle-01"><div class="inner"></div></div>
        <div class="circle circle-02"><div class="inner"></div></div>
        <div class="circle circle-03"><div class="inner"></div></div>
        <div class="circle circle-04"><div class="inner"></div></div>
    </div>
</template>

<script>
    import Sha256 from 'js-sha256';

    module.exports = {
        data () {
            return {
                form: {
                    user_name: '',
                    password: ''
                },
                flag: navigator.userAgent.toLowerCase().indexOf('webkit') != -1
            }
        },
        methods: {
            login (e) {
                e.preventDefault();
                var _this = this;

                if (_this.form.user_name == '') {
                    _this.$message.error('请输入用户名');
                    return;
                } else if (_this.form.password == '') {
                    _this.$message.error('请输入密码');
                    return;
                }

                _this.$post({
                    url: '/user/login',
                    data: {
                        user_name: _this.form.user_name,
                        password: Sha256(_this.form.password)
                    },
                    success: function (res) {

                        _this.$router.push({
                            path: '/activityList'
                        });

                    }
                });
            }
        }
    };
</script>

<style>
    .login-wrap .login-form{
        width: 480px;
        padding: 40px 80px 45px 80px;
        position: absolute;
        top: 45%;
        left: 50%;
        z-index: 2;
        transform: translate(-50%, -50%);
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        box-shadow: 0 2px 15px -5px #000000, inset 0 1px 3px #ffffff;
        perspective: 1000px;
    }
    .login-wrap .title{
        text-align: center;
        font-size: 36px;
        text-shadow: 1px 2px 0px #eeeeee;
        padding-bottom: 10px;
    }
    .login-wrap .input-wrap{
        position: relative;
        border: 1px solid #bbbbbb;
        border-radius: 4px;
        background-color: #ffffff;
        padding-left: 70px;
        height: 40px;
        overflow: hidden;
        margin-top: 20px;
    }
    .login-wrap .col-txt{
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 70px;
        height: 40px;
        line-height: 40px;
        padding-right: 10px;
        text-align: right;
        font-size: 14px;
        font-weight: bold;
        color: #666666;
    }
    .login-wrap .input{
        border: none;
        width: 100%;
        height: 38px;
        font-size: 14px;
        padding: 12px 0 10px 0;
    }
    .login-wrap .btn{
        width: 100%;
        height: 40px;
        color: #ffffff;
        font-size: 14px;
        font-weight: bold;
        border: 1px solid #3563bb;
        border-radius: 4px;
        background: #3563bb;
        box-shadow: 0 2px 5px -2px #000000, inset 0 1px 1px #cccccc;
    }
    .login-wrap .btn:active{
        background: #2c539e;
    }
    .login-wrap .link{
        color: #3563bb;
    }
    .login-wrap .link:hover{
        color: #2c539e;
    }
    .login-wrap .header-box{
        position: absolute;
        top: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 -2px 5px #333333, inset 0 -1px 3px #eeeeee;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #19305b;
        font-weight: bold;
    }
    .login-wrap .footer-box{
        position: absolute;
        bottom: 0;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0 2px 5px #333333, inset 0 1px 3px #eeeeee;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        color: #19305b;
        font-weight: bold;
    }
    .login-wrap .icon-chrome{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url(../imgs/chrome.png);
        background-size: 100% 100%;
        vertical-align: middle;
        margin-top: -2px;
    }
    .login-wrap .circle{
        border-radius: 100%;
        background-color: rgba(255, 255, 255, 0.2);
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
    }
    .login-wrap .circle .inner{
        padding-bottom: 100%;
    }
    .login-wrap .circle-01{
        width: 100px;
        margin-top: -360px;
        margin-left: -400px;
    }
    .login-wrap .circle-02{
        width: 150px;
        margin-top: -320px;
        margin-left: -350px;
    }
    .login-wrap .circle-03{
        width: 50px;
        margin-top: 130px;
        margin-left: 250px;
    }
    .login-wrap .circle-04{
        width: 20px;
        margin-top: 175px;
        margin-left: 300px;
    }
</style>
