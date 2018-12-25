<template>
    <div v-if="curModule">
        <p class="lh30px f14px text-center">
            楼层{{curFloorIndex + 1}}
        </p>
        <div class="floor-module" style="width: 70%;">
            <div class="floor-title" v-if="!(curModule.floorList[curFloorIndex].floorType == 'twoCol' && curModule.floorList[curFloorIndex].titleImgPosition == 'in')">
                <div class="placeholder" v-if="!curModule.floorList[curFloorIndex].titleImg">
                    <i class="el-icon-picture-outline cm-text-light rel"
                       style="font-size: 24px; top: -5px; display: inline-block; vertical-align: middle">
                    </i>
                    <span class="f12px cm-text-light ml5px">
                        请输入楼层标题图url
                    </span>
                </div>

                <img v-else :src="curModule.floorList[curFloorIndex].titleImg">
            </div>

            <div class="goods-wrap" :style="{backgroundColor: pageBgColor}">
                <img v-if="curModule.floorList[curFloorIndex].floorType == 'simple'"
                     src="../../imgs/floor.png">
                <img v-if="curModule.floorList[curFloorIndex].floorType == 'slide'"
                     src="../../imgs/slide-floor.png">
                <img v-if="curModule.floorList[curFloorIndex].floorType == 'twoCol' && curModule.floorList[curFloorIndex].titleImgPosition == 'in'"
                     src="../../imgs/two-col-in.png">
                <img v-if="curModule.floorList[curFloorIndex].floorType == 'twoCol' && curModule.floorList[curFloorIndex].titleImgPosition == 'top'"
                     src="../../imgs/two-col-top.png">

                <template v-if="curModule.floorList[curFloorIndex].floorType == 'twoCol' && curModule.floorList[curFloorIndex].titleImgPosition == 'in'">
                    <div class="placeholder" v-if="!curModule.floorList[curFloorIndex].titleImg">
                        <i class="el-icon-picture-outline cm-text-light mb10px"
                           style="font-size: 36px; margin-top: 64px; display: block; vertical-align: middle">
                        </i>
                        <span class="f12px cm-text-light">
                            请输入楼层标题图url
                        </span>
                    </div>

                    <div class="title-img" v-else="">
                        <img :src="curModule.floorList[curFloorIndex].titleImg">
                    </div>
                </template>
            </div>
        </div>

        <p class="cm-text-red text-center mt10px">
            * 楼层中的商品仅为示意图
        </p>

        <p class="f14px mb10px mt20px">模块{{curModuleIndex + 1}} - 楼层列表</p>

        <ul>
            <li v-for="(item, index) in curModule.floorList"
                class="sub-list-item"
                :class="{'sub-list-item-close': index != curFloorIndex}"
                @click="handleCurFloor(index)">
                <div class="title">
                    楼层{{index + 1}}
                </div>

                <table width="100%;" class="f14px">
                    <tr>
                        <td class="pb10px"
                            align="right"
                            width="75">
                            楼层名称：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入楼层名称"
                                v-model.trim="item.name"
                                style="width: 274px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="pb10px"
                            align="right">
                            楼层类型：
                        </td>
                        <td class="pb10px">
                            <el-select
                                placeholder="请选择楼层类型"
                                v-model="item.floorType"
                                @change="handleFloorChange"
                                style="width: 274px;">
                                <el-option
                                    v-for="(value, key) in dict.floorType"
                                    :key="key"
                                    :value="key"
                                    :label="value">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="pb10px"
                            align="right">
                            标题图片：
                        </td>
                        <td class="pb10px">
                            <el-input
                                placeholder="请输入标题图片url"
                                v-model.trim="item.titleImg"
                                @change="handleFloorChange"
                                style="width: 274px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr v-show="item.floorType == 'twoCol'">
                        <td class="pb10px"
                            align="right">
                            标题位置：
                        </td>
                        <td class="pb10px">
                            <el-select
                                placeholder="请选择标题位置"
                                v-model="item.titleImgPosition"
                                @change="handleFloorChange"
                                style="width: 274px;">
                                <el-option
                                    v-for="(value, key) in dict.titleImgPosition"
                                    :key="key"
                                    :value="key"
                                    :label="value">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="pb10px"
                            align="right">
                            活动类型：
                        </td>
                        <td class="pb10px">
                            <el-select
                                v-model="item.activityType"
                                placeholder="请选择活动类型"
                                style="width: 274px;">
                                <el-option
                                    v-for="(value, key) in dict.activityType"
                                    :key="key"
                                    :value="key"
                                    :label="value">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="pb10px"
                            align="right">
                            　活动ID：
                        </td>
                        <td class="pb10px">
                            <el-input
                                v-model.trim="item.activityId"
                                style="width: 274px;">
                            </el-input>
                        </td>
                    </tr>
                </table>

                <el-button
                    class="btn btn-up"
                    type="default"
                    icon="el-icon-arrow-up"
                    :disabled="index == 0"
                    v-show="index == curFloorIndex"
                    @click="handleUpFloor($event, index)">
                </el-button>

                <el-button
                    class="btn btn-down"
                    type="default"
                    icon="el-icon-arrow-down"
                    :disabled="index == curModule.floorList.length - 1"
                    v-show="index == curFloorIndex"
                    @click="handleDownFloor($event, index)">
                </el-button>

                <el-button
                    :disabled="curModule.floorList.length <= 1"
                    class="btn"
                    type="default"
                    icon="el-icon-delete"
                    @click="handleDelFloor($event, index)">
                </el-button>
            </li>
        </ul>

        <el-button
            type="primary"
            icon="el-icon-plus"
            @click="handleAddFloor">
            添加楼层
        </el-button>
    </div>
</template>

<script>
    module.exports = {
        replace: true,
        props: ['pageBgColor'],
        data () {
            return {
                curModule: null,
                curModuleIndex: 0,
                curFloorIndex: 0,

                initFlag: false
            };
        },
        computed: {
            dict () {
                return this.$store.state.dict.activityPage;
            }
        },
        methods: {
            setData (curModule, curModuleIndex, curFloorIndex) {
                var _this = this;
                _this.curModule = JSON.parse(JSON.stringify(curModule));
                _this.curModuleIndex = curModuleIndex;

                if (curFloorIndex !== undefined) {
                    _this.curFloorIndex = curFloorIndex;
                }

                _this.$nextTick(function () {
                    _this.initFlag = true;
                });
            },

            getData () {
                return JSON.parse(JSON.stringify(this.curModule));
            },

            handleAddFloor () {
                var _this = this;

                _this.curModule.floorList.push({
                    name: '',
                    floorType: 'simple',
                    titleImg: '',
                    titleImgPosition: 'top',
                    activityType: '',
                    activityId: ''
                });

                _this.curFloorIndex = _this.curModule.floorList.length - 1;
                _this.$emit('moduleChange');
            },
            handleDelFloor (e, index) {
                e.stopPropagation();
                e.currentTarget.blur();
                var _this = this;

                if (index <= _this.curFloorIndex && _this.curFloorIndex != 0) {
                    _this.curFloorIndex--;
                }

                _this.curModule.floorList.splice(index, 1);
                _this.$emit('moduleChange', true);
            },
            handleUpFloor (e, index) {
                e.stopPropagation();
                e.currentTarget.blur();
                var _this = this,
                    targetFloor = _this.curModule.floorList.splice(index, 1)[0];

                _this.curModule.floorList.splice(index - 1, 0, targetFloor);

                _this.curFloorIndex--;
                _this.$emit('moduleChange', true);
            },
            handleDownFloor (e, index) {
                e.stopPropagation();
                e.currentTarget.blur();
                var _this = this,
                    targetFloor = _this.curModule.floorList.splice(index, 1)[0];

                _this.curModule.floorList.splice(index + 1, 0, targetFloor);

                _this.curFloorIndex++;
                _this.$emit('moduleChange', true);
            },
            handleCurFloor (index) {
                this.curFloorIndex = index;
            },
            handleFloorChange () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            }
        }
    };
</script>
