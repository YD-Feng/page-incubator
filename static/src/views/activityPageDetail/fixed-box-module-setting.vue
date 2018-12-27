<template>
    <div v-if="curModule">
        <div class="fixed-box-module">
            <div class="fixed-box" :style="createModalStyle()">
                <i v-if="!curModule.bgImg"
                   class="placeholder el-icon-picture-outline"
                   style="font-size: 32px;">
                </i>
                <img v-else :src="curModule.bgImg">
            </div>
        </div>

        <table style="width: 100%;" class="mt15px f14px">
            <tr>
                <td colspan="2" class="lh30px pb10px">
                    模块背景图：

                    <el-input
                        placeholder="请输入模块背景图url"
                        v-model.trim="curModule.bgImg"
                        style="width: 276px;">
                    </el-input>
                </td>
            </tr>
            <tr>
                <td width="50%" class="lh30px pb10px">
                    窗体宽度：
                    <el-input
                        placeholder="请输入窗体宽度"
                        v-model.trim="curModule.moduleWidth"
                        style="width: 90px;">
                    </el-input>
                </td>
                <td width="50%" class="lh30px pb10px">
                    窗体高度：
                    <el-input
                        placeholder="请输入窗体高度"
                        v-model.trim="curModule.moduleHeight"
                        style="width: 90px;">
                    </el-input>
                </td>
            </tr>
            <tr>
                <td width="50%" class="lh30px pb10px">
                    <el-select
                        v-model="curModule.topOrBottom"
                        @change="handleTbChange"
                        style="width: 80px;">
                        <el-option value="top" label="距离上边"></el-option>
                        <el-option value="bottom" label="距离下边"></el-option>
                    </el-select>：
                    <el-input
                        v-show="curModule.topOrBottom == 'top'"
                        placeholder="请输入距离上边"
                        v-model.trim="curModule.moduleTop"
                        style="width: 66px;">
                    </el-input>
                    <el-input
                        v-show="curModule.topOrBottom == 'bottom'"
                        placeholder="请输入距离下边"
                        v-model.trim="curModule.moduleBottom"
                        style="width: 66px;">
                    </el-input>
                </td>
                <td width="50%" class="lh30px pb10px">
                    <el-select
                        v-model="curModule.leftOrRight"
                        @change="handleLrChange"
                        style="width: 80px;">
                        <el-option value="left" label="距离左边"></el-option>
                        <el-option value="right" label="距离右边"></el-option>
                    </el-select>：
                    <el-input
                        v-show="curModule.leftOrRight == 'left'"
                        placeholder="请输入距离左边"
                        v-model.trim="curModule.moduleLeft"
                        style="width: 66px;">
                    </el-input>
                    <el-input
                        v-show="curModule.leftOrRight == 'right'"
                        placeholder="请输入距离右边"
                        v-model.trim="curModule.moduleRight"
                        style="width: 66px;">
                    </el-input>
                </td>
            </tr>
        </table>

        <p class="cm-text-red lh20px">
            注意：<br>
            1. 悬浮窗始终位于屏幕内<br>
            2. 悬浮窗的 距离上、下、左、右边 是相对于屏幕而言的<br>
        </p>

        <p class="f14px mb5px mt15px lh30px">
            悬浮窗链接
        </p>

        <ul>
            <li v-for="(item, index) in curModule.linkList"
                class="sub-list-item">
                <table width="100%;" class="f14px mt10px">
                    <tr>
                        <td class="pb10px"
                            align="right"
                            width="75">
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
            </li>
        </ul>
    </div>
</template>

<script>
    module.exports = {
        replace: true,
        props: ['linkTypeValName', 'moduleList', 'floorModule', 'modalModuleList'],
        data () {
            return {
                curModule: null,
                curModuleIndex: 0,
                curLinkIndex: 0,

                colorList: [
                    '#e64d21',
                    '#1890FF',
                    '#2FC25B',
                    '#ff9f00',
                    '#422b00',
                    '#690ce0',
                    '#0410c7',
                    '#ff7bcc'
                ],

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
            'curModule.moduleWidth': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.moduleHeight': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.topOrBottom': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.leftOrRight': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.moduleTop': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.moduleLeft': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.moduleBottom': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.moduleRight': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            }
        },
        methods: {
            setData (curModule, curModuleIndex, curFloorIndex) {
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

            createModalStyle () {
                var _this = this,
                    scale = 290 / 750,
                    result = {
                        width: (Math.floor(scale * _this.curModule.moduleWidth) || 0) + 'px',
                        height: (Math.floor(scale * _this.curModule.moduleHeight) || 0) + 'px',
                        border: _this.curModule.bgImg ? 'none' : '1px dashed #ffffff'
                    };

                if (_this.curModule.topOrBottom == 'top') {
                    result.top = (Math.floor(scale * _this.curModule.moduleTop) || 0) + 'px';
                } else if (_this.curModule.topOrBottom == 'bottom') {
                    result.bottom = (Math.floor(scale * _this.curModule.moduleBottom) || 0) + 'px';
                }

                if (_this.curModule.leftOrRight == 'left') {
                    result.left = (Math.floor(scale * _this.curModule.moduleLeft) || 0) + 'px';
                } else if (_this.curModule.leftOrRight == 'right') {
                    result.right = (Math.floor(scale * _this.curModule.moduleRight) || 0) + 'px';
                }

                return result;
            },

            handleTbChange () {
                this.curModule.moduleTop = 0;
                this.curModule.moduleBottom = 0;
            },
            handleLrChange () {
                this.curModule.moduleLeft = 0;
                this.curModule.moduleRight = 0;
            },

            handleLinkTypeChange () {
                var _this = this;

                if (!_this.initFlag) {
                    return;
                }

                var target = _this.curModule.linkList[_this.curLinkIndex];

                target.linkValue = '';
                target.moduleIndex = '';
                target.floorIndex = '';
                target.modalIndex = '';
                target.targetSmallProgram = '';
            }
        }
    };
</script>
