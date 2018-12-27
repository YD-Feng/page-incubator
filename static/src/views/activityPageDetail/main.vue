<template>
    <div class="cm-inner-page activity-page-detail">
        <div class="cm-back-btn-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动页面</el-breadcrumb-item>
                <el-breadcrumb-item>编辑页面</el-breadcrumb-item>
            </el-breadcrumb>

            <el-button
                class="btn-back"
                type="default"
                @click="goBack">
                返回&nbsp;&gt;&gt;
            </el-button>
        </div>

        <!--预加载两个图片-->
        <img class="hide" src="../../imgs/floor.png">
        <img class="hide" src="../../imgs/slide-floor.png">
        <img class="hide" src="../../imgs/two-col-in.png">
        <img class="hide" src="../../imgs/two-col-top.png">

        <div class="main-wrap">
            <!--预览区-->
            <div class="preview-wrap">
                <preview
                    ref="preview"
                    :page-bg-color="pageBgColor"
                    :module-list="moduleList"
                    :cur-module="curModule"
                    @clickModule="handleCurModule">
                </preview>
                <div class="text-center mt20px">
                    <el-button type="primary" @click="handleSave">保存页面</el-button>
                    <el-button type="success" @click="handleRefresh">刷新预览</el-button>
                    <el-button type="default" @click="goBack">取消编辑</el-button>
                </div>
            </div>


            <!--编辑页面模块-->
            <div class="module-manage-wrap">
                <div class="f14px pb10px">
                    页面所属城市：<span class="cm-text-blue fBold">{{areaName}}</span>
                </div>

                <div class="f14px pt10px pb5px">
                    页面标题：
                    <el-input
                        placeholder="请输入页面标题"
                        v-model.trim="pageTitle"
                        style="width: 183px;">
                    </el-input>
                </div>

                <div class="f14px pt10px pb5px">
                    页面背景色：
                    <color-setter
                        v-model="pageBgColor"
                        :colorListVisible="false"
                        style="display: inline-block;">
                    </color-setter>
                </div>

                <ul class="mt10px">
                    <li class="module-item"
                        :class="{'module-item-close': curModuleIndex != index}"
                        v-for="(item, index) in moduleList"
                        @click="handleCurModule(index)">
                        <p class="f16px fBold pb20px">
                            {{(index + 1) + '. ' + dict.moduleType[item.moduleType]}}
                        </p>

                        <table width="100%" class="f14px">
                            <tr>
                                <td class="pb10px lh30px">
                                    模块类型：
                                    <el-select
                                        v-model="item.moduleType"
                                        style="width: 220px;"
                                        @change="handleModuleTypeChange">
                                        <el-option
                                            v-for="(value, key) in dict.moduleType"
                                            :disabled="checkOptionDisabled(index, key)"
                                            :key="key"
                                            :value="key"
                                            :label="value">
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>
                        </table>

                        <el-button
                            class="btn btn-up"
                            type="default"
                            icon="el-icon-arrow-up"
                            :disabled="index == 0"
                            v-show="index == curModuleIndex"
                            @click="handleUpModule($event, index)">
                        </el-button>

                        <el-button
                            class="btn btn-down"
                            type="default"
                            icon="el-icon-arrow-down"
                            :disabled="index == moduleList.length - 1"
                            v-show="index == curModuleIndex"
                            @click="handleDownModule($event, index)">
                        </el-button>

                        <el-button
                            class="btn btn-del"
                            type="default"
                            icon="el-icon-delete"
                            @click="handleDelModule($event, index)">
                        </el-button>
                    </li>
                </ul>

                <div class="no-data" v-if="moduleList.length == 0">
                    未添加任何模块
                </div>

                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="handleAddModule">
                    添加新模块
                </el-button>
            </div>

            <!--模块预览-->
            <div class="module-view-wrap">
                <p class="lh40px f14px fBold">模块预览</p>

                <div class="no-data" v-if="moduleList.length == 0">
                    请先添加模块
                </div>

                <div v-for="(module, moduleIndex) in moduleList"
                     v-if="moduleIndex == curModuleIndex">
                    <!--常规模块-->
                    <simple-module-setting
                        v-if="curModule && curModule.moduleType == 'simple'"
                        :ref="'moduleSetting-' + moduleIndex"
                        :key="'moduleSetting-' + moduleIndex"
                        :link-type-val-name="linkTypeValName"
                        :module-list="moduleList"
                        :floor-module="floorModule"
                        @showIllustration="openDialog"
                        @moduleChange="handleModuleChange">
                    </simple-module-setting>

                    <!--楼层模块-->
                    <floor-module-setting
                        v-if="curModule && curModule.moduleType == 'floor'"
                        :ref="'moduleSetting-' + moduleIndex"
                        :key="'moduleSetting-' + moduleIndex"
                        :page-bg-color="pageBgColor"
                        @moduleChange="handleModuleChange">
                    </floor-module-setting>

                    <!--楼层菜单模块-->
                    <floor-menu-module-setting
                        v-if="curModule && curModule.moduleType == 'floorMenu'"
                        :ref="'moduleSetting-' + moduleIndex"
                        :key="'moduleSetting-' + moduleIndex"
                        @moduleChange="handleModuleChange">
                    </floor-menu-module-setting>

                    <!--滑动Banner模块-->
                    <banner-module-setting
                        v-if="curModule && curModule.moduleType == 'slideBanner'"
                        :ref="'moduleSetting-' + moduleIndex"
                        :key="'moduleSetting-' + moduleIndex"
                        :page-bg-color="pageBgColor"
                        :link-type-val-name="linkTypeValName"
                        :module-list="moduleList"
                        :floor-module="floorModule"
                        @showIllustration="openDialog"
                        @moduleChange="handleModuleChange">
                    </banner-module-setting>

                    <modal-module-setting
                        v-if="curModule && curModule.moduleType == 'modal'"
                        :ref="'moduleSetting-' + moduleIndex"
                        :key="'moduleSetting-' + moduleIndex"
                        :link-type-val-name="linkTypeValName"
                        :module-list="moduleList"
                        :floor-module="floorModule"
                        @showIllustration="openDialog"
                        @moduleChange="handleModuleChange">
                    </modal-module-setting>

                    <fixed-box-module-setting
                        v-if="curModule && curModule.moduleType == 'fixedBox'"
                        :ref="'moduleSetting-' + moduleIndex"
                        :key="'moduleSetting-' + moduleIndex"
                        :link-type-val-name="linkTypeValName"
                        :module-list="moduleList"
                        :floor-module="floorModule"
                        @moduleChange="handleModuleChange">
                    </fixed-box-module-setting>
                </div>
            </div>
        </div>

        <el-dialog
            title="链接配置说明"
            :visible.sync="dialog.visible"
            custom-class="activity-page-dialog-480px">
            <div class="pl20px pr20px">
                <p class="text-center pb20px">
                    <img src="../../imgs/example.png"/>
                </p>
                <p class="pb10px">
                    A. 请保证切图（设计稿）的宽度为 <span class="cm-text-red fBold">750px</span>，链接热区的位置配置都必须以此为基础量出的距离才有效
                </p>
                <p class="pb5px">
                    B. 热区的宽高，<span class="cm-text-blue">相对切图</span>上边、左边的距离，可使用 PhotoShop 在切图上量出。<span class="cm-text-red fBold">测量方法请见上方示意图</span>
                </p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import colorSetter from '../../components/color-setter.vue';
    import preview from './preview.vue';
    import simpleModuleSetting from './simple-module-setting.vue';
    import floorModuleSetting from './floor-module-setting.vue';
    import floorMenuModuleSetting from './floor-menu-module-setting.vue';
    import bannerModuleSetting from './banner-module-setting.vue';
    import modalModuleSetting from './modal-module-setting.vue';
    import fixedBoxModuleSetting from './fixed-box-module-setting.vue';

    //模块对象
    var defaultModule = JSON.stringify({
        moduleType: 'simple',
        bgImg: '',
        menuFontColor: '#ffffff',
        menuCurColor: '#f8fb40',
        menuBgColor: '#2a469c',
        moduleWidth: 0,
        moduleHeight: 0,
        topOrBottom: 'top',
        leftOrRight: 'left',
        moduleTop: 0,
        moduleLeft: 0,
        moduleBottom: 0,
        moduleRight: 0,
        bannerHotAreaFlag: false,
        bannerBottomBtnFlag: true,
        bannerSwitchEffect: 'slide',
        linkList: [],
        floorList: [
            {
                name: '',
                floorType: 'simple',
                titleImg: '',
                titleImgPosition: 'top',
                activityType: '',
                activityId: ''
            }
        ],
        bannerList: [
            {
                img: '',
                linkType: '',
                linkValue: '',
                moduleIndex: '',
                floorIndex: '',
                modalIndex: '',
                targetSmallProgram: ''
            }
        ]
    });

    module.exports = {
        components: {
            colorSetter: colorSetter,
            preview: preview,
            simpleModuleSetting: simpleModuleSetting,
            floorModuleSetting: floorModuleSetting,
            floorMenuModuleSetting: floorMenuModuleSetting,
            bannerModuleSetting: bannerModuleSetting,
            modalModuleSetting: modalModuleSetting,
            fixedBoxModuleSetting: fixedBoxModuleSetting
        },
        data () {
            return {
                pageId: '',
                initFlag: false,

                areaName: '',
                pageTitle: '',
                pageBgColor: '#ffffff',
                moduleList: [],

                curModuleIndex: -1,

                linkTypeValName: {
                    goods: '商品ID',
                    activity: '活动ID',
                    packActivity: '活动ID',
                    coupon: '活动ID',
                    module: '跳转模块',
                    floor: '跳转楼层',
                    modalOpen: '目标弹窗',
                    smallProgram: '目标程序',
                    other: '链接地址'
                },

                dialog: {
                    visible: false
                },

                timeout: null
            }
        },
        computed: {
            areaData () {
                var obj = {};

                this.$store.state.area.areaList.forEach(function (item) {
                    obj[item.area_id] = item;
                });

                return obj;
            },
            dict () {
                return this.$store.state.dict.activityPage;
            },
            curModule () {
                var _this = this;
                return _this.moduleList[_this.curModuleIndex];
            },
            floorModule () {
                var result = {
                    module: {
                        floorList: []
                    },
                    index: -1
                };

                this.moduleList.forEach(function (item, index) {
                    if (item.moduleType == 'floor') {
                        result.module = item;
                        result.index = index;
                    }
                });

                return result;
            },
            bannerModule () {
                var result = {
                    module: null,
                    index: -1
                };

                this.moduleList.forEach(function (item, index) {
                    if (item.moduleType == 'slideBanner') {
                        result.module = item;
                        result.index = index;
                    }
                });

                return result;
            }
        },
        methods: {
            checkOptionDisabled (moduleIndex, moduleType) {
                var _this = this;
                return ( (_this.floorModule.index != -1 && _this.floorModule.index != moduleIndex && moduleType == 'floor') ||
                    (_this.bannerModule.index != -1 && _this.bannerModule.index != moduleIndex && (moduleType == 'slideBanner')) );
            },

            getActivityPageDetail () {
                var _this = this;

                _this.$get({
                    url: '/activityPage/getActivityPageDetail',
                    data: {
                        page_id: _this.pageId
                    },
                    success: function (res) {
                        _this.areaName = _this.areaData[res.data.area_id].area_name;

                        if (res.data.setting) {
                            var setting = JSON.parse(res.data.setting);
                            _this.pageTitle = setting.pageTitle;
                            _this.pageBgColor = setting.pageBgColor;

                            _this.moduleList = setting.moduleList.map(function (module) {
                                // 这里为了填坑，要对数据做处理
                                // 1期的孵化器直接通过 moduleType 来指定楼层类型
                                // 2期则改为为各个楼层添加 floorType 属性来指定楼层类型
                                // 以适配多个楼层的时候，可以同时存在不同楼层类型的场景
                                // 所以这里对1期的配置数据做兼容处理，但同时不能影响二期的数据
                                // 只在获取数据的时候做兼容处理，保存的时候则以新的数据结构保存
                                // 这段处理逻辑可在3期酌情注释掉
                                if (module.moduleType == 'floor' || module.moduleType == 'slideFloor') {
                                    // 1期会有 slideFloor 这一种 moduleType，在2期就移除了
                                    module.floorList.forEach(function (floor) {
                                        if (floor.floorType === undefined) {
                                            // moduleType 与 floorType 的对应关系
                                            var obj = {
                                                floor: 'simple',
                                                slideFloor: 'slide'
                                            };
                                            // 如果 floorType 未定义，则说明这是1期的数据，补上 floorType 属性
                                            floor.floorType = obj[module.moduleType];
                                        }
                                        if (floor.titleImgPosition === undefined) {
                                            floor.titleImgPosition = 'top';
                                        }
                                    });
                                }

                                // 继续补全2期新增属性
                                module.moduleWidth = module.moduleWidth !== undefined ? module.moduleWidth : 0;
                                module.moduleHeight = module.moduleHeight !== undefined ? module.moduleHeight : 0;
                                module.topOrBottom = module.topOrBottom !== undefined ? module.topOrBottom : 'top';
                                module.leftOrRight = module.leftOrRight !== undefined ? module.leftOrRight : 'left';
                                module.moduleTop = module.moduleTop !== undefined ? module.moduleTop : 0;
                                module.moduleLeft = module.moduleLeft !== undefined ? module.moduleLeft : 0;
                                module.moduleBottom = module.moduleBottom !== undefined ? module.moduleBottom : 0;
                                module.moduleRight = module.moduleRight !== undefined ? module.moduleRight : 0;
                                module.bannerHotAreaFlag = module.bannerHotAreaFlag !== undefined ? module.bannerHotAreaFlag : false;
                                module.bannerBottomBtnFlag = module.bannerBottomBtnFlag !== undefined ? module.bannerBottomBtnFlag : true;
                                module.bannerSwitchEffect = module.bannerSwitchEffect !== undefined ? module.bannerSwitchEffect : 'slide';

                                module.linkList.forEach(function (link) {
                                    link.modalIndex = link.modalIndex !== undefined ? link.modalIndex : '';
                                    link.targetSmallProgram = link.targetSmallProgram !== undefined ? link.targetSmallProgram : '';
                                });

                                module.bannerList.forEach(function (banner) {
                                    banner.modalIndex = banner.modalIndex !== undefined ? banner.modalIndex : '';
                                    banner.targetSmallProgram = banner.targetSmallProgram !== undefined ? banner.targetSmallProgram : '';
                                });

                                return module;
                            });
                        }

                        if (_this.moduleList.length > 0) {
                            _this.handleCurModule(0);
                        }

                        _this.$nextTick(function () {
                            _this.initFlag = true;
                        });
                    }
                });
            },

            handleAddModule () {
                var _this = this,
                    module = JSON.parse(defaultModule);

                _this.moduleList.push(module);
                _this.curModuleIndex = _this.moduleList.length - 1;

                _this.$nextTick(function () {
                    _this.$refs['moduleSetting-' + _this.curModuleIndex][0].setData(_this.curModule, _this.curModuleIndex);
                });
            },
            handleDelModule (e, index) {
                e.stopPropagation();
                e.currentTarget.blur();
                var _this = this;

                if (index <= _this.curModuleIndex) {
                    //如果 当前编辑模块 在 删除模块 之前，要把 curModuleIndex 减去1 再删除模块，否则会引发报错
                    //因为删除模块后，当前编辑模块的 index 就比之前小 1 了
                    if (_this.curModuleIndex != 0) {
                        _this.curModuleIndex--;
                    }
                }

                _this.moduleList.splice(index, 1);

                _this.$nextTick(function () {
                    if (_this.moduleList.length > 0) {
                        _this.$refs['moduleSetting-' + _this.curModuleIndex][0].setData(_this.curModule, _this.curModuleIndex);
                    }
                    _this.resetLink();
                });
            },
            handleUpModule (e, index) {
                e.stopPropagation();
                e.currentTarget.blur();
                var _this = this,
                    targetModule = _this.moduleList.splice(index, 1)[0];

                _this.moduleList.splice(index - 1, 0, targetModule);

                _this.curModuleIndex--;

                _this.$nextTick(function () {
                    _this.$refs['moduleSetting-' + _this.curModuleIndex][0].setData(_this.curModule, _this.curModuleIndex);
                    _this.resetLink();
                });
            },
            handleDownModule (e, index) {
                e.stopPropagation();
                e.currentTarget.blur();
                var _this = this,
                    targetModule = _this.moduleList.splice(index, 1)[0];

                _this.moduleList.splice(index + 1, 0, targetModule);

                _this.curModuleIndex++;

                _this.$nextTick(function () {
                    _this.$refs['moduleSetting-' + _this.curModuleIndex][0].setData(_this.curModule, _this.curModuleIndex);
                    _this.resetLink();
                });
            },
            handleCurModule (moduleIndex, floorIndex) {
                var _this = this,
                    oldIndex = _this.curModuleIndex;

                if (moduleIndex == oldIndex && floorIndex === undefined) {
                    return;
                }

                if (_this.initFlag) {
                    _this.$set(_this.moduleList, oldIndex, _this.$refs['moduleSetting-' + oldIndex][0].getData());
                }

                _this.curModuleIndex = moduleIndex;

                _this.$nextTick(function () {
                    _this.$refs['moduleSetting-' + moduleIndex][0].setData(_this.curModule, _this.curModuleIndex, floorIndex);
                });
            },
            handleModuleTypeChange (val) {
                var _this = this,
                    size = {
                        slideBanner: {
                            width: 0,
                            height: 230
                        },
                        modal: {
                            width: 500,
                            height: 600
                        },
                        fixedBox: {
                            width: 120,
                            height: 120
                        }
                    };

                if (!_this.initFlag) {
                   return;
                }

                _this.curModule.bgImg = '';
                _this.curModule.moduleWidth = size[val] ? size[val].width : 0;
                _this.curModule.moduleHeight = size[val] ? size[val].height : 0;
                _this.curModule.topOrBottom = 'top';
                _this.curModule.leftOrRight = 'left';
                _this.curModule.moduleTop = 0;
                _this.curModule.moduleLeft = 0;
                _this.curModule.moduleBottom = 0;
                _this.curModule.moduleRight = 0;
                _this.curModule.bannerHotAreaFlag = false;
                _this.curModule.bannerBottomBtnFlag = true;
                _this.curModule.bannerSwitchEffect = 'slide';

                _this.curModule.floorList = [
                    {
                        name: '',
                        floorType: 'simple',
                        titleImg: '',
                        titleImgPosition: 'top',
                        activityType: '',
                        activityId: ''
                    }
                ];

                _this.curModule.bannerList = [
                    {
                        img: '',
                        linkType: '',
                        linkValue: '',
                        moduleIndex: '',
                        floorIndex: '',
                        modalIndex: '',
                        targetSmallProgram: ''
                    }
                ];

                if (val == 'slideBanner') {
                    //滑动Banner要给它加两个默认链接，且这个链接是无法移除的
                    _this.curModule.linkList = [
                        {
                            width: 50,
                            height: 50,
                            left: 30,
                            top: 95,
                            linkType: '',
                            linkValue: '',
                            moduleIndex: '',
                            floorIndex: '',
                            modalIndex: '',
                            targetSmallProgram: ''
                        },
                        {
                            width: 50,
                            height: 50,
                            left: 670,
                            top: 95,
                            linkType: '',
                            linkValue: '',
                            moduleIndex: '',
                            floorIndex: '',
                            modalIndex: '',
                            targetSmallProgram: ''
                        }
                    ];
                } else if (val == 'fixedBox') {
                    //悬浮窗要给它加一个默认链接，且这个链接是无法移除的
                    _this.curModule.linkList = [
                        {
                            width: 0,
                            height: 0,
                            left: 0,
                            top: 0,
                            linkType: '',
                            linkValue: '',
                            moduleIndex: '',
                            floorIndex: '',
                            modalIndex: '',
                            targetSmallProgram: ''
                        }
                    ];
                } else {
                    _this.curModule.linkList = [];
                }

                _this.$nextTick(function () {
                    _this.$refs['moduleSetting-' + _this.curModuleIndex][0].setData(_this.curModule, _this.curModuleIndex);
                    _this.resetLink();
                });
            },
            handleModuleChange (flag) {
                var _this = this;
                _this.timeout = setTimeout(function () {
                    if (flag) {
                        _this.resetLink();
                    } else {
                        _this.$set(_this.moduleList, _this.curModuleIndex, _this.$refs['moduleSetting-' + _this.curModuleIndex][0].getData());
                    }
                }, 300);
            },

            handleSave () {
                var _this = this;

                //保存前同步一下最后操作的模块数据到主组件
                _this.$set(_this.moduleList, _this.curModuleIndex, _this.$refs['moduleSetting-' + _this.curModuleIndex][0].getData());

                try {

                    if (_this.pageTitle === '') {
                        throw {message: '页面标题不能为空'};
                    }

                    if (_this.pageBgColor === '') {
                        throw {message: '页面背景颜色不能为空'};
                    }

                    _this.moduleList.forEach(function (module, moduleIndex) {

                        if (module.moduleType == 'simple') {
                            //常规模块

                            if (module.bgImg === '') {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的模块背景图url不能为空'};
                            }

                            _this.checkLink(module, moduleIndex);

                        } else if (module.moduleType == 'floor') {
                            //楼层模块

                            module.floorList.forEach(function (floor, floorIndex) {
                                if (floor.name === '') {
                                    throw {message: '【模块' + (moduleIndex + 1) + ' - 楼层' + (floorIndex + 1) + '】的楼层名称不能为空'};
                                }

                                if (floor.titleImg === '') {
                                    throw {message: '【模块' + (moduleIndex + 1) + ' - 楼层' + (floorIndex + 1) + '】的标题图片url不能为空'};
                                }

                                if (floor.activityId === '') {
                                    throw {message: '请选择【模块' + (moduleIndex + 1) + ' - 楼层' + (floorIndex + 1) + '】的活动类型'};
                                }

                                if (floor.activityId === '') {
                                    throw {message: '【模块' + (moduleIndex + 1) + ' - 楼层' + (floorIndex + 1) + '】的活动ID不能为空'};
                                }
                            });

                        } else if (module.moduleType == 'floorMenu') {
                            //楼层菜单模块

                            if (module.menuFontColor === '') {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的菜单字体颜色不能为空'};
                            }

                            if (module.menuCurColor === '') {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的高亮字体颜色不能为空'};
                            }

                            if (module.menuBgColor === '') {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的菜单背景颜色不能为空'};
                            }

                        } else if (module.moduleType == 'slideBanner') {
                            //滑动banner模块
                            var validateHeight = _this.validateNumber(module.moduleHeight);
                            if (validateHeight) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的Banner高度' + validateHeight};
                            }

                            module.bannerList.forEach(function (banner, bannerIndex) {
                                if (module.img === '') {
                                    throw {message: '【模块' + (moduleIndex + 1) + ' - Banner' + (bannerIndex + 1) + '】的图片url不能为空'};
                                }

                                _this.checkLinkJump(banner, '【模块' + (moduleIndex + 1) + ' - Banner' + (bannerIndex + 1) + '】');
                            });

                            if (module.bannerHotAreaFlag) {
                                module.linkList.forEach(function (link, linkIndex) {
                                    var validateWidth = _this.validateNumber(link.width);
                                    if (validateWidth) {
                                        throw {message: '【模块' + (moduleIndex + 1) + ' - ' + (linkIndex == 0 ? '上一张切换热区' : '下一张切换热区') + '】的热区宽度' + validateWidth};
                                    }

                                    var validateHeight = _this.validateNumber(link.height);
                                    if (validateHeight) {
                                        throw {message: '【模块' + (moduleIndex + 1) + ' - ' + (linkIndex == 0 ? '上一张切换热区' : '下一张切换热区') + '】的热区高度' + validateHeight};
                                    }

                                    var validateTop = _this.validateNumber(link.top);
                                    if (validateTop) {
                                        throw {message: '【模块' + (moduleIndex + 1) + ' - ' + (linkIndex == 0 ? '上一张切换热区' : '下一张切换热区') + '】的距离上边' + validateTop};
                                    }

                                    var validateLeft = _this.validateNumber(link.left);
                                    if (validateLeft) {
                                        throw {message: '【模块' + (moduleIndex + 1) + ' - ' + (linkIndex == 0 ? '上一张切换热区' : '下一张切换热区') + '】的距离左边' + validateLeft};
                                    }
                                });
                            }

                        } else if (module.moduleType == 'modal') {
                            //弹窗模块
                            if (module.bgImg === '') {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的模块背景图url不能为空'};
                            }

                            var validateWidth = _this.validateNumber(module.moduleWidth);
                            if (validateWidth) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的弹窗宽度' + validateWidth};
                            }

                            var validateHeight = _this.validateNumber(module.moduleHeight);
                            if (validateHeight) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的弹窗高度' + validateHeight};
                            }

                            _this.checkLink(module, moduleIndex);

                        } else if (module.moduleType == 'fixedBox') {
                            //悬浮窗模块
                            if (module.bgImg === '') {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的模块背景图url不能为空'};
                            }

                            var validateWidth = _this.validateNumber(module.moduleWidth);
                            if (validateWidth) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的窗体宽度' + validateWidth};
                            }

                            var validateHeight = _this.validateNumber(module.moduleHeight);
                            if (validateHeight) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的窗体高度' + validateHeight};
                            }

                            var validateWidth = _this.validateNumber(module.moduleTop);
                            if (validateWidth) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的距离上边' + validateWidth};
                            }

                            var validateHeight = _this.validateNumber(module.moduleLeft);
                            if (validateHeight) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的距离左边' + validateHeight};
                            }

                            var validateHeight = _this.validateNumber(module.moduleBottom);
                            if (validateHeight) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的距离下边' + validateHeight};
                            }

                            var validateHeight = _this.validateNumber(module.moduleRight);
                            if (validateHeight) {
                                throw {message: '【模块' + (moduleIndex + 1) + '】的距离右边' + validateHeight};
                            }

                            _this.checkLinkJump(module.linkList[0], '【模块' + (moduleIndex + 1) + ' - 悬浮窗链接】');

                        }

                    });

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                _this.$post({
                    url: '/activityPage/update',
                    data: {
                        page_id: _this.pageId,
                        setting: JSON.stringify({
                            pageTitle: _this.pageTitle,
                            pageBgColor: _this.pageBgColor,
                            moduleList: _this.moduleList
                        })
                    },
                    success: function (res) {
                        _this.$message.success('保存成功');
                        _this.goBack();
                    }
                });
            },
            validateNumber (val) {
                if (val === '') {
                    return '不能为空';
                } else if (!/^[\-\+]?\d+$/.test(val)) {
                    return '必须输入整数';
                } else if (val * 1 < 0) {
                    return '不能小于0';
                }

                return false;
            },
            checkLink (module, moduleIndex) {
                var _this = this;

                module.linkList.forEach(function (link, linkIndex) {
                    var validateWidth = _this.validateNumber(link.width);
                    if (validateWidth) {
                        throw {message: '【模块' + (moduleIndex + 1) + ' - 链接' + (linkIndex + 1) + '】的热区宽度' + validateWidth};
                    }

                    var validateHeight = _this.validateNumber(link.height);
                    if (validateHeight) {
                        throw {message: '【模块' + (moduleIndex + 1) + ' - 链接' + (linkIndex + 1) + '】的热区高度' + validateHeight};
                    }

                    var validateTop = _this.validateNumber(link.top);
                    if (validateTop) {
                        throw {message: '【模块' + (moduleIndex + 1) + ' - 链接' + (linkIndex + 1) + '】的距离上边' + validateTop};
                    }

                    var validateLeft = _this.validateNumber(link.left);
                    if (validateLeft) {
                        throw {message: '【模块' + (moduleIndex + 1) + ' - 链接' + (linkIndex + 1) + '】的距离左边' + validateLeft};
                    }

                    _this.checkLinkJump(link, '【模块' + (moduleIndex + 1) + ' - 链接' + (linkIndex + 1) + '】');
                });
            },
            checkLinkJump (link, linkName) {
                var _this = this;

                if (link.linkType === '') {
                    throw {message: '请选择' + linkName + '的链接类型'};
                }

                if ((link.linkType == 'goods' ||
                    link.linkType == 'activity' ||
                    link.linkType == 'packActivity' ||
                    link.linkType == 'coupon' ||
                    link.linkType == 'other') &&
                    link.linkValue === '') {
                    var str = linkName +
                        '的' +
                        _this.linkTypeValName[link.linkType] +
                        '不能为空';

                    throw {message: str};
                }

                if (link.linkType == 'module' && link.moduleIndex === '') {
                    var str = '请选择' + linkName +
                        '的' +
                        _this.linkTypeValName[link.linkType];

                    throw {message: str};
                }

                if (link.linkType == 'floor' && link.floorIndex === '') {
                    var str = '请选择' + linkName +
                        '的' +
                        _this.linkTypeValName[link.linkType];

                    throw {message: str};
                }

                if (link.linkType == 'modalOpen' && link.modalIndex === '') {
                    var str = '请选择' + linkName +
                        '的' +
                        _this.linkTypeValName[link.linkType];

                    throw {message: str};
                }

                if (link.linkType == 'smallProgram' && link.targetSmallProgram === '') {
                    var str = '请选择' + linkName +
                        '的' +
                        _this.linkTypeValName[link.linkType];

                    throw {message: str};
                }

                if (link.linkType == 'smallProgram' && link.linkValue === '') {
                    var str = linkName + '的跳转地址不能为空';

                    throw {message: str};
                }
            },

            resetLink () {
                var _this = this;

                if (_this.moduleList.length == 0) {
                    return;
                }

                //重置链接前先同步一下最后操作的模块数据到主组件
                _this.$set(_this.moduleList, _this.curModuleIndex, _this.$refs['moduleSetting-' + _this.curModuleIndex][0].getData());

                _this.moduleList.forEach(function (module) {
                    module.linkList.forEach(function (link) {
                        if (link.linkType == 'module' || link.linkType == 'floor' || link.linkType == 'modalOpen') {
                            link.linkValue = '';
                            link.moduleIndex = '';
                            link.floorIndex = '';
                            link.modalIndex = '';
                            link.targetSmallProgram = '';
                        }
                    });

                    module.bannerList.forEach(function (banner) {
                        if (banner.linkType == 'module' || banner.linkType == 'floor' || banner.linkType == 'modalOpen') {
                            banner.linkValue = '';
                            banner.moduleIndex = '';
                            banner.floorIndex = '';
                            banner.modalIndex = '';
                            banner.targetSmallProgram = '';
                        }
                    });
                });

                _this.$nextTick(function () {
                    //重置链接后再把最新的模块配置数据传到子组件
                    _this.$refs['moduleSetting-' + _this.curModuleIndex][0].setData(_this.curModule, _this.curModuleIndex);
                    _this.$message.info('由于模块或楼层信息发生变动，与模块跳转、楼层跳转，打开弹窗相关的链接信息被系统重置，请重新检查填写各个模块的链接配置！');
                });
            },

            openDialog () {
                this.dialog.visible = true;
            },
            closeDialog () {
                this.dialog.visible = false;
            },

            handleRefresh () {
                this.$refs.preview.refresh();
            },
            goBack () {
                this.$router.go(-1);
            }
        },
        created () {
            var _this = this;
            _this.pageId = _this.$route.params.pageId;
            _this.getActivityPageDetail();

            window.vm = this;
        }
    };
</script>

<style>
    .activity-page-dialog-480px{
        width: 480px;
    }
</style>
