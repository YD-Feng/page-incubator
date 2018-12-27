<template>
    <div v-if="curModule">
        <div class="banner-module" :style="createBannerStyle()">
            <ul :style="{left: curBannerIndex * (-100) + '%', transition: switchEffect[curModule.bannerSwitchEffect]}">
                <li v-for="(item, $index) in curModule.bannerList"
                    :key="$index">
                    <a :href="item.url">
                        <div class="placeholder" v-if="!item.img">
                            <i class="el-icon-picture-outline cm-text-light"
                               style="font-size: 40px;">
                            </i>
                        </div>

                        <img v-else :src="item.img">
                    </a>
                </li>
            </ul>

            <ol v-show="curModule.bannerBottomBtnFlag">
                <li v-for="(item, $index) in curModule.bannerList"
                    :key="$index"
                    :class="{current: $index == curBannerIndex}">
                </li>
            </ol>

            <div class="link-area"
                 v-for="(item, index) in curModule.linkList"
                 v-if="curModule.bannerHotAreaFlag"
                 :style="createLinkStyle(item, index)">
            </div>
        </div>

        <table style="width: 100%;" class="mt15px f14px">
            <tr>
                <td colspan="2" class="lh30px pb10px">
                    模块占位图：
                    <el-input
                        placeholder="请输入模块占位图url（可为空，用于占位或背景）"
                        v-model.trim="curModule.bgImg"
                        style="width: 296px;">
                    </el-input>
                </td>
            </tr>
            <tr>
                <td width="50%" class="lh30px pb10px">
                    Banner高度：
                    <el-input
                        placeholder="请输入Banner高度"
                        v-model.trim="curModule.moduleHeight"
                        style="width: 90px;">
                    </el-input>
                </td>
                <td width="50%" class="lh30px pb10px pl20px">
                    切换效果：
                    <el-select
                        placeholder="请选择Banner切换效果"
                        v-model="curModule.bannerSwitchEffect"
                        style="width: 90px;">
                        <el-option
                            v-for="(value, key) in dict.bannerSwitchEffect"
                            :key="key"
                            :value="key"
                            :label="value">
                        </el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="lh30px pb10px">
                    是否开启Banner底部轮播标识：

                    <el-radio-group v-model="curModule.bannerBottomBtnFlag">
                        <el-radio-button :label="false">关闭</el-radio-button>
                        <el-radio-button :label="true">开启</el-radio-button>
                    </el-radio-group>
                </td>
            </tr>
            <tr>
                <td colspan="2" class="lh30px">
                    是否开启Banner切换热区：

                    <el-radio-group v-model="curModule.bannerHotAreaFlag" @change="handleHotAreaFlagChange">
                        <el-radio-button :label="false">关闭</el-radio-button>
                        <el-radio-button :label="true">开启</el-radio-button>
                    </el-radio-group>
                </td>
            </tr>
        </table>

        <template v-if="curModule.bannerHotAreaFlag">
            <p class="f14px mb5px mt15px lh30px">
                Banner切换热区链接
                <el-button
                    type="text"
                    style="vertical-align: top;"
                    @click="showIllustration">
                    查看链接配置说明
                    <i class="el-icon-question"></i>
                </el-button>
            </p>

            <ul>
                <li v-for="(item, index) in curModule.linkList"
                    class="sub-list-item">
                    <div class="title">
                        {{index == 0 ? '热区 - 上一张' : '热区 - 下一张'}}
                    </div>

                    <table width="100%;" class="f14px">
                        <tr>
                            <td width="50%" class="pb10px">
                                热区宽度：
                                <el-input
                                    placeholder="请输入"
                                    v-model.trim="item.width"
                                    style="width: 85px;">
                                </el-input>
                            </td>
                            <td width="50%" class="pb10px pl10px">
                                热区高度：
                                <el-input
                                    placeholder="请输入"
                                    v-model.trim="item.height"
                                    style="width: 85px;">
                                </el-input>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%" class="pb10px">
                                距离上边：
                                <el-input
                                    placeholder="请输入"
                                    v-model.trim="item.top"
                                    style="width: 85px;">
                                </el-input>
                            </td>
                            <td width="50%" class="pb10px pl10px">
                                距离左边：
                                <el-input
                                    placeholder="请输入"
                                    v-model.trim="item.left"
                                    style="width: 85px;">
                                </el-input>
                            </td>
                        </tr>
                    </table>
                </li>
            </ul>
        </template>

        <p class="f14px mb10px mt20px">模块{{curModuleIndex + 1}} - Banner列表</p>

        <ul>
            <li v-for="(item, index) in curModule.bannerList"
                class="sub-list-item"
                :class="{'sub-list-item-close': index != curBannerIndex}"
                @click="handleCurBanner(index)">
                <div class="title">
                    Banner{{index + 1}}
                </div>

                <table width="100%;" class="f14px">
                    <tr>
                        <td class="pb10px"
                            align="right"
                            width="75">
                            图片url：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入图片url"
                                v-model.trim="item.img"
                                @change="handleBannerChange"
                                style="width: 274px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="pb10px"
                            align="right">
                            链接类型：
                        </td>
                        <td class="pb10px">
                            <el-select
                                v-model="item.linkType"
                                placeholder="请选择链接类型"
                                style="width: 274px;"
                                @change="handleLinkTypeChange">
                                <el-option
                                    v-for="(value, key) in dict.linkType"
                                    :key="key"
                                    :value="key"
                                    :label="value">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr v-if="item.linkType && item.linkType != 'myCoupons' && item.linkType != 'pageTop' && item.linkType != 'modalClose'">
                        <td class="pb10px"
                            align="right">
                            {{linkTypeValName[item.linkType]}}：
                        </td>
                        <td class="pb10px">
                            <el-select
                                v-if="item.linkType == 'module'"
                                :placeholder="'请选择' + linkTypeValName[item.linkType]"
                                v-model="item.moduleIndex"
                                style="width: 274px;">
                                <el-option
                                    v-for="(module, moduleIndex) in moduleList"
                                    v-if="module.moduleType == 'simple'"
                                    :key="moduleIndex"
                                    :value="moduleIndex"
                                    :label="(moduleIndex + 1) + '. ' + dict.moduleType[module.moduleType]">
                                </el-option>
                            </el-select>

                            <el-select
                                v-else-if="item.linkType == 'floor'"
                                :placeholder="'请选择' + linkTypeValName[item.linkType]"
                                v-model="item.floorIndex"
                                style="width: 274px;">
                                <el-option
                                    v-for="(floor, floorIndex) in floorModule.module.floorList"
                                    :key="floorIndex"
                                    :value="floorIndex"
                                    :label="'楼层' + (floorIndex + 1)">
                                </el-option>
                            </el-select>

                            <el-select
                                v-else-if="item.linkType == 'modalOpen'"
                                :placeholder="'请选择' + linkTypeValName[item.linkType]"
                                v-model="item.modalIndex"
                                style="width: 274px;">
                                <el-option
                                    v-for="(module, moduleIndex) in moduleList"
                                    v-if="module.moduleType == 'modal'"
                                    :key="moduleIndex"
                                    :value="moduleIndex"
                                    :label="(moduleIndex + 1) + '. ' + dict.moduleType[module.moduleType]">
                                </el-option>
                            </el-select>

                            <el-select
                                v-else-if="item.linkType == 'smallProgram'"
                                :placeholder="'请选择' + linkTypeValName[item.linkType]"
                                v-model="item.targetSmallProgram"
                                style="width: 274px;">
                                <el-option
                                    v-for="(value, key) in dict.smallProgram"
                                    :key="key"
                                    :value="key"
                                    :label="value">
                                </el-option>
                            </el-select>

                            <el-input
                                v-else
                                :placeholder="'请输入' + linkTypeValName[item.linkType]"
                                v-model.trim="item.linkValue"
                                style="width: 274px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr v-if="item.linkType == 'smallProgram' && item.targetSmallProgram">
                        <td class="pb10px"
                            align="right">
                            跳转地址：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入跳转地址"
                                v-model.trim="item.linkValue"
                                style="width: 274px;">
                            </el-input>
                        </td>
                    </tr>
                </table>

                <el-button
                    :disabled="curModule.bannerList.length <= 1"
                    class="btn"
                    type="default"
                    icon="el-icon-delete"
                    @click="handleDelBanner($event, index)">
                </el-button>
            </li>
        </ul>

        <el-button
            :disabled="curModule.bannerList.length >= 4"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddBanner">
            添加Banner
        </el-button>
        <span class="cm-text-orange"
              v-if="curModule.bannerList.length >= 4">
            （每个模块最多4个Banner，无法继续添加）
        </span>
    </div>
</template>

<script>
    module.exports = {
        replace: true,
        props: ['pageBgColor', 'linkTypeValName', 'moduleList', 'floorModule', 'modalModuleList'],
        data () {
            return {
                curModule: null,
                curModuleIndex: 0,
                curBannerIndex: 0,

                switchEffect: {
                    slide: 'left 0.3s',
                    none: ''
                },

                initFlag: false
            };
        },
        computed: {
            dict () {
                return this.$store.state.dict.activityPage;
            }
        },
        watch: {
            'curModule.bgImg': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.moduleHeight': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            }
        },
        methods: {
            setData (curModule, curModuleIndex) {
                var _this = this;
                _this.curModule = JSON.parse(JSON.stringify(curModule));
                _this.curModuleIndex = curModuleIndex;

                _this.$nextTick(function () {
                    _this.initFlag = true;
                });
            },

            getData () {
                return JSON.parse(JSON.stringify(this.curModule));
            },

            showIllustration () {
                this.$emit('showIllustration');
            },

            handleAddBanner () {
                var _this = this;

                _this.curModule.bannerList.push({
                    img: '',
                    linkType: '',
                    linkValue: '',
                    moduleIndex: '',
                    floorIndex: '',
                    modalIndex: '',
                    targetSmallProgram: ''
                });

                _this.curBannerIndex = _this.curModule.bannerList.length - 1;
                _this.$emit('moduleChange');
            },
            handleDelBanner (e, index) {
                e.stopPropagation();
                var _this = this;

                if (index <= _this.curBannerIndex) {
                    //如果 当前编辑模块 在 删除模块 之前，要把 curBannerIndex 减去1 再删除模块，否则会引发报错
                    //因为删除模块后，当前编辑模块的 index 就比之前小 1 了
                    _this.curBannerIndex--;
                }

                _this.curModule.bannerList.splice(index, 1);
                _this.$emit('moduleChange');
            },
            handleCurBanner (index) {
                this.curBannerIndex = index;
            },

            handleLinkTypeChange () {
                var _this = this;

                if (!_this.initFlag) {
                    return;
                }

                var target = _this.curModule.bannerList[_this.curBannerIndex];

                target.linkValue = '';
                target.moduleIndex = '';
                target.floorIndex = '';
                target.modalIndex = '';
                target.targetSmallProgram = '';
            },

            handleHotAreaFlagChange () {
                if (this.initFlag) {
                    this.curModule.linkList.forEach(function (link, index) {
                        link.width = 50;
                        link.height = 50;
                        link.left = index == 0 ? 30 : 670;
                        link.top = 95;
                    });
                }
            },

            createBannerStyle () {
                var _this = this,
                    scale = 400 / 750;

                return {
                    backgroundImage: _this.curModule.bgImg ? 'url("' + _this.curModule.bgImg + '")' : 'none',
                    backgroundColor: _this.pageBgColor,
                    height: (Math.floor(scale * _this.curModule.moduleHeight) || 0) + 'px'
                };
            },

            createLinkStyle (item, index) {
                var _this = this,
                    scale = 400 / 750;

                return {
                    width: (Math.floor(scale * item.width) || 0) + 'px',
                    height: (Math.floor(scale * item.height) || 0) + 'px',
                    left: (Math.floor(scale * item.left) || 0) + 'px',
                    top: (Math.floor(scale * item.top) || 0) + 'px',
                    border: '1px solid #1890FF',
                    boxShadow: '0 0 2px #e64d21',
                    zIndex: 2
                };
            },

            handleBannerChange () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            }
        }
    };
</script>
