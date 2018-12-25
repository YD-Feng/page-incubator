<template>
    <div class="preview-wrap-inner">
        <div class="preview-content"
             :style="{backgroundColor: pageBgColor}">
            <div class="preview-status-bar"></div>
            <div v-bar style="width: 100%; height: 100%;">
                <div>
                    <div v-if="refreshFlag"></div>
                    <ul>
                        <li v-for="(module, moduleIndex) in moduleList">
                            <div class="simple-module"
                                 v-if="module.moduleType == 'simple'"
                                 @click="handleCurPreview(moduleIndex)">
                                <div class="placeholder"
                                     v-if="!module.bgImg">
                                    <i class="el-icon-picture-outline cm-text-light"
                                       style="font-size: 72px;">
                                    </i>
                                    <p class="f14px cm-text-light">
                                        请输入模块背景图url
                                    </p>
                                </div>

                                <img v-else :src="module.bgImg">
                            </div>

                            <div class="floor-module"
                                 v-if="module.moduleType == 'floor'"
                                 v-for="(floor, floorIndex) in module.floorList"
                                 @click="handleCurPreview(moduleIndex, floorIndex)">
                                <div class="floor-title" v-if="!(floor.floorType == 'twoCol' && floor.titleImgPosition == 'in')">
                                    <div class="placeholder" v-if="!floor.titleImg">
                                        <i class="el-icon-picture-outline cm-text-light rel"
                                           style="font-size: 24px; top: -5px; display: inline-block; vertical-align: middle">
                                        </i>
                                        <span class="f12px cm-text-light ml5px">
                                            请输入楼层标题图url
                                        </span>
                                    </div>

                                    <img v-else :src="floor.titleImg">
                                </div>

                                <div class="goods-wrap">
                                    <img v-if="floor.floorType == 'simple'"
                                         src="../../imgs/floor.png">
                                    <img v-if="floor.floorType == 'slide'"
                                         src="../../imgs/slide-floor.png">
                                    <img v-if="floor.floorType == 'twoCol' && floor.titleImgPosition == 'in'"
                                         src="../../imgs/two-col-in.png">
                                    <img v-if="floor.floorType == 'twoCol' && floor.titleImgPosition == 'top'"
                                         src="../../imgs/two-col-top.png">

                                    <template v-if="floor.floorType == 'twoCol' && floor.titleImgPosition == 'in'">
                                        <div class="placeholder" v-if="!floor.titleImg">
                                            <i class="el-icon-picture-outline cm-text-light mb10px"
                                               style="font-size: 36px; margin-top: 64px; display: block; vertical-align: middle">
                                            </i>
                                            <span class="f12px cm-text-light">
                                                请输入楼层标题图url
                                            </span>
                                        </div>

                                        <div class="title-img" v-else="">
                                            <img :src="floor.titleImg">
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div v-if="module.moduleType == 'floorMenu'"
                                 class="menu-module"
                                 :style="{backgroundColor: module.menuBgColor, color: module.menuFontColor}"
                                 @click="handleCurPreview(moduleIndex)">
                                <ul class="oh"
                                    :style="{backgroundColor: module.menuBgColor, color: module.menuFontColor}">
                                    <li class="menu-item current"
                                        :style="{color: module.menuCurColor}">
                                        楼层名称A
                                        <div class="line"
                                             :style="{backgroundColor: module.menuCurColor}">
                                        </div>
                                    </li>
                                    <li class="menu-item">
                                        楼层名称B
                                        <div class="line"></div>
                                    </li>
                                    <li class="menu-item">
                                        楼层名称C
                                        <div class="line"></div>
                                    </li>
                                </ul>

                                <i class="btn icon-font icon-xia"></i>
                            </div>

                            <div class="banner-module"
                                 :style="createBannerStyle(module)"
                                 v-if="module.moduleType == 'slideBanner'"
                                 @click="handleCurPreview(moduleIndex)">
                                <ul :style="{left: curBannerIndex * (-100) + '%'}">
                                    <li v-for="(item, $index) in module.bannerList"
                                        :key="$index">
                                        <a :href="item.url">
                                            <div class="placeholder" v-if="!item.img">
                                                <i class="el-icon-picture-outline cm-text-light"
                                                   style="font-size: 29px;">
                                                </i>
                                            </div>

                                            <img v-else :src="item.img">
                                        </a>
                                    </li>
                                </ul>
                                <ol>
                                    <li v-for="(item, $index) in module.bannerList"
                                        :key="$index"
                                        :class="{current: $index == 0}">
                                    </li>
                                </ol>
                            </div>

                            <div class="fixed-box-module"
                                 v-if="module.moduleType == 'fixedBox'"
                                 @click="handleCurPreview(moduleIndex)">
                                <div class="fixed-box" :style="createFixedBoxStyle(module)">
                                    <i v-if="!module.bgImg"
                                       class="placeholder el-icon-picture-outline"
                                       style="font-size: 32px;">
                                    </i>
                                    <img v-else :src="module.bgImg">
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="modal-module"
             v-if="curModule && curModule.moduleType == 'modal'">
            <div class="modal-item" :style="createModalStyle()">
                <img v-show="curModule.bgImg" :src="curModule.bgImg">
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        replace: true,
        props: ['pageBgColor', 'moduleList', 'curModule'],
        data () {
            return {
                refreshFlag: false,
            };
        },
        methods: {
            handleCurPreview (moduleIndex, floorIndex) {
                this.$emit('clickModule', moduleIndex, floorIndex);
            },

            createBannerStyle (module) {
                var scale = 290 / 640;

                return {
                    backgroundImage: module.bgImg ? 'url("' + module.bgImg + '")' : 'none',
                    height: (Math.floor(scale * module.moduleHeight) || 0) + 'px',
                };
            },

            createModalStyle () {
                var _this = this,
                    scale = 290 / 640;

                return {
                    width: (Math.floor(scale * _this.curModule.moduleWidth) || 0) + 'px',
                    height: (Math.floor(scale * _this.curModule.moduleHeight) || 0) + 'px',
                    border: _this.curModule.bgImg ? 'none' : '1px dashed #ffffff'
                };
            },

            createFixedBoxStyle (module) {
                var scale = 290 / 640,
                    result = {
                        width: (Math.floor(scale * module.moduleWidth) || 0) + 'px',
                        height: (Math.floor(scale * module.moduleHeight) || 0) + 'px',
                        border: module.bgImg ? 'none' : '1px dashed #ffffff'
                    };

                if (module.topOrBottom == 'top') {
                    result.top = (Math.floor(scale * module.moduleTop) || 0) + 'px';
                } else if (module.topOrBottom == 'bottom') {
                    result.bottom = (Math.floor(scale * module.moduleBottom) || 0) + 'px';
                }

                if (module.leftOrRight == 'left') {
                    result.left = (Math.floor(scale * module.moduleLeft) || 0) + 'px';
                } else if (module.leftOrRight == 'right') {
                    result.right = (Math.floor(scale * module.moduleRight) || 0) + 'px';
                }

                return result;
            },

            refresh () {
                this.refreshFlag = !this.refreshFlag;
            }
        }
    };
</script>

<style scoped>
    .preview-wrap-inner{
        width: 320px;
        height: 650px;
        position: relative;
        background: #111111;
        border-radius: 55px;
        box-shadow: 0 0 0 2px #aaaaaa;
        padding: 70px 15px 95px 15px;
    }
    .preview-wrap-inner:before {
        content: '';
        width: 60px;
        height: 10px;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        margin-left: -30px;
        background: #333333;
        top: 30px;
    }
    .preview-wrap-inner:after {
        content: '';
        position: absolute;
        width: 60px;
        height: 60px;
        left: 50%;
        margin-left: -30px;
        bottom: 20px;
        border-radius: 100%;
        box-sizing: border-box;
        border: 5px solid #333333;
    }
    .preview-content{
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative;
        padding-top: 20px;
    }
    .preview-status-bar {
        position: absolute;
        width: 100%;
        height: 20px;
        background: url("../../imgs/phone-top.png") no-repeat;
        background-size: 100% 100%;
        top: 0;
        left: 0;
    }
    .modal-module{
        position: absolute;
        z-index: 10;
        top: 90px;
        bottom: 95px;
        left: 15px;
        right: 15px;
        background-color: rgba(0, 0, 0, 0.6);
    }
</style>
