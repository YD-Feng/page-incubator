<template>
    <div v-if="curModule">
        <div class="simple-module">
            <div class="placeholder" v-if="!curModule.bgImg">
                <i class="el-icon-picture-outline cm-text-light"
                   style="font-size: 100px;">
                </i>
                <p class="f14px cm-text-light">
                    请输入模块背景图url
                </p>
            </div>

            <img v-else :src="curModule.bgImg">

            <div class="link-area"
                 v-for="(item, index) in curModule.linkList"
                 :style="createStyle(item, index)"
                 @click="handleCurLink(index)">
            </div>
        </div>

        <table style="width: 100%;" class="mt20px f14px">
            <tr>
                <td class="lh30px">
                    模块背景图：

                    <el-input
                        placeholder="请输入模块背景图url"
                        v-model.trim="curModule.bgImg"
                        style="width: 276px;">
                    </el-input>
                </td>
            </tr>
        </table>

        <p class="f14px mb5px mt15px lh30px">
            模块{{curModuleIndex + 1}} - 链接列表
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
                class="sub-list-item"
                :class="{'sub-list-item-close': index != curLinkIndex}"
                @click="handleCurLink(index)">
                <div class="title">
                    <div class="color-block"
                         :style="{backgroundColor: colorList[index]}">
                    </div>
                    链接{{index + 1}}
                </div>

                <table width="100%" class="f14px">
                    <tr>
                        <td width="75"
                            align="right"
                            class="pb10px">
                            热区宽度：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入"
                                v-model.trim="item.width"
                                style="width: 95px;">
                            </el-input>
                        </td>
                        <td width="75"
                            align="right"
                            class="pb10px">
                            热区高度：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入"
                                v-model.trim="item.height"
                                style="width: 95px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td align="right"
                            class="pb10px">
                            距离上边：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入"
                                v-model.trim="item.top"
                                style="width: 95px;">
                            </el-input>
                        </td>
                        <td align="right"
                            class="pb10px">
                            距离左边：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入"
                                v-model.trim="item.left"
                                style="width: 95px;">
                            </el-input>
                        </td>
                    </tr>
                </table>
                <table width="100%;" class="f14px">
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

                <el-button
                    class="btn"
                    type="default"
                    icon="el-icon-delete"
                    @click="handleDelLink($event, index)">
                </el-button>
            </li>
        </ul>

        <div class="no-data"
             v-if="curModule.linkList.length == 0">
            未添加任何链接
        </div>

        <el-button
            :disabled="curModule.linkList.length >= 8"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddLink">
            添加链接
        </el-button>
        <span class="cm-text-orange"
              v-if="curModule.linkList.length >= 8">
            （每个模块最多8个链接，无法继续添加）
        </span>
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

            handleAddLink () {
                var _this = this;

                _this.curModule.linkList.push({
                    width: 200,
                    height: 100,
                    left: 220,
                    top: 110,
                    linkType: '',
                    linkValue: '',
                    moduleIndex: '',
                    floorIndex: '',
                    modalIndex: '',
                    targetSmallProgram: ''
                });

                _this.curLinkIndex = _this.curModule.linkList.length - 1;
            },
            handleDelLink (e, index) {
                e.stopPropagation();
                var _this = this;

                if (index <= _this.curLinkIndex) {
                    //如果 当前编辑模块 在 删除模块 之前，要把 curModuleIndex 减去1 再删除模块，否则会引发报错
                    //因为删除模块后，当前编辑模块的 index 就比之前小 1 了
                    _this.curLinkIndex--;
                }

                _this.curModule.linkList.splice(index, 1);
            },
            handleCurLink (index) {
                this.curLinkIndex = index;
            },
            createStyle (item, index) {
                var _this = this,
                    scale = 400 / 640;

                return {
                    width: (Math.floor(scale * item.width) || 0) + 'px',
                    height: (Math.floor(scale * item.height) || 0) + 'px',
                    left: (Math.floor(scale * item.left) || 0) + 'px',
                    top: (Math.floor(scale * item.top) || 0) + 'px',
                    backgroundColor: _this.curLinkIndex == index ? _this.colorList[index] : 'transparent',
                    opacity: _this.curLinkIndex == index ? 0.9 : 1,
                    border: _this.curLinkIndex == index ? 'none' : '1px solid ' + _this.colorList[index],
                    zIndex: _this.curLinkIndex == index ? 2 : 1
                };
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
