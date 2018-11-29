<template>
    <div class="cm-inner-page">
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

        <div class="main-wrap">
            <!--预览区-->
            <div class="preview-wrap">
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
                                             @click="handleCurPreview(module, moduleIndex)">
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
                                             v-if="module.moduleType == 'floor' || module.moduleType == 'slideFloor'"
                                             v-for="(floor, floorIndex) in module.floorList"
                                             @click="handleCurPreview(module, moduleIndex, floorIndex)">
                                            <div class="floor-title">
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

                                            <div>
                                                <img v-if="module.moduleType == 'floor'"
                                                     src="../../imgs/floor.png">
                                                <img v-if="module.moduleType == 'slideFloor'"
                                                     src="../../imgs/slide-floor.png">
                                            </div>
                                        </div>

                                        <div v-if="module.moduleType == 'floorMenu'"
                                             class="menu-module"
                                             :style="{backgroundColor: module.menuBgColor, color: module.menuFontColor}"
                                             @click="handleCurPreview(module, moduleIndex)">
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

                                            <i class="btn icon-font icon-you1"></i>
                                        </div>

                                        <div class="banner-module"
                                             v-if="module.moduleType == 'slideBanner'"
                                             @click="handleCurPreview(module, moduleIndex)">
                                            <ul :style="{left: curBannerIndex * (-100) + '%'}">
                                                <li v-for="(item, $index) in module.bannerList"
                                                    :key="$index">
                                                    <a :href="item.url">
                                                        <div class="placeholder" v-if="!item.img">
                                                            <i class="el-icon-picture-outline cm-text-light"
                                                               style="font-size: 29px;">
                                                            </i>
                                                            <p class="f14px lh20px cm-text-light">
                                                                请输入Banner图url
                                                            </p>
                                                        </div>

                                                        <img v-else :src="item.img">
                                                    </a>
                                                </li>
                                            </ul>
                                            <ol>
                                                <li v-for="(item, $index) in module.bannerList"
                                                    :key="$index"
                                                    :class="{current: $index == curBannerIndex}">
                                                </li>
                                            </ol>
                                        </div>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>

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
                        v-model="pageTitle"
                        style="width: 183px;">
                    </el-input>
                </div>

                <div class="f14px pt10px pb5px">
                    页面背景色：
                    <color-setter
                        v-model="pageBgColor"
                        :colorListVisible="false"
                        style="display: inline-block">
                    </color-setter>
                </div>

                <ul class="mt10px">
                    <li class="module-item"
                        :class="{'module-item-close': curModuleIndex != index}"
                        v-for="(item, index) in moduleList"
                        @click="handleCurModule(index)">
                        <p class="f16px fBold pb20px">
                            模块{{index + 1}}
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
                                            :disabled="floorModule.index != -1 && floorModule.index != index && (key == 'floor' || key == 'slideFloor')"
                                            :key="key"
                                            :value="key"
                                            :label="value">
                                        </el-option>
                                    </el-select>
                                </td>
                            </tr>

                            <tr v-show="item.moduleType == 'simple'">
                                <td class="pb10px lh30px">
                                    模块背景图：

                                    <el-input
                                        placeholder="请输入模块背景图url"
                                        v-model="item.bgImg"
                                        style="width: 206px;">
                                    </el-input>
                                </td>
                            </tr>

                            <tr v-show="item.moduleType == 'floorMenu'">
                                <td class="pb10px lh30px">
                                    菜单字体颜色：
                                    <color-setter
                                        v-model="item.menuFontColor"
                                        :colorListVisible="false"
                                        style="display: inline-block">
                                    </color-setter>
                                </td>
                            </tr>

                            <tr v-show="item.moduleType == 'floorMenu'">
                                <td class="pb10px lh30px">
                                    高亮字体颜色：
                                    <color-setter
                                        v-model="item.menuCurColor"
                                        :colorListVisible="false"
                                        style="display: inline-block">
                                    </color-setter>
                                </td>
                            </tr>

                            <tr v-show="item.moduleType == 'floorMenu'">
                                <td class="pb10px lh30px">
                                    菜单背景颜色：
                                    <color-setter
                                        v-model="item.menuBgColor"
                                        :colorListVisible="false"
                                        style="display: inline-block">
                                    </color-setter>
                                </td>
                            </tr>
                        </table>

                        <el-button
                            class="btn"
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

                <div class="no-data" v-if="!curModule">
                    请先添加模块
                </div>

                <!--常规模块-->
                <div v-if="curModule && curModule.moduleType == 'simple'">
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

                    <p class="f14px mb10px mt20px">模块{{curModuleIndex + 1}} - 链接列表</p>

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

                            <table width="100%;" class="f14px">
                                <tr>
                                    <td width="50%" class="pb10px">
                                        热区宽度：
                                        <el-input
                                            placeholder="请输入"
                                            v-model="item.width"
                                            style="width: 85px;">
                                        </el-input>
                                    </td>
                                    <td width="50%" class="pb10px pl10px">
                                        热区高度：
                                        <el-input
                                            placeholder="请输入"
                                            v-model="item.height"
                                            style="width: 85px;">
                                        </el-input>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%" class="pb10px">
                                        距离上边：
                                        <el-input
                                            placeholder="请输入"
                                            v-model="item.top"
                                            style="width: 85px;">
                                        </el-input>
                                    </td>
                                    <td width="50%" class="pb10px pl10px">
                                        距离左边：
                                        <el-input
                                            placeholder="请输入"
                                            v-model="item.left"
                                            style="width: 85px;">
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
                                <tr v-if="item.linkType && item.linkType != 'myCoupons' && item.linkType != 'pageTop'">
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
                                                :key="moduleIndex"
                                                :value="moduleIndex"
                                                :label="'模块' + (moduleIndex + 1)">
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

                                        <el-input
                                            v-else
                                            :placeholder="'请输入' + linkTypeValName[item.linkType]"
                                            v-model="item.linkValue"
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

                <!--商品楼层-->
                <div v-if="curModule && (curModule.moduleType == 'floor' || curModule.moduleType == 'slideFloor')">
                    <p class="lh30px f14px text-center">
                        楼层{{curFloorIndex + 1}}
                    </p>
                    <div class="floor-module" style="width: 70%;">
                        <div class="floor-title">
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

                        <div :style="{backgroundColor: pageBgColor}">
                            <img v-if="curModule.moduleType == 'floor'"
                                 src="../../imgs/floor.png">
                            <img v-if="curModule.moduleType == 'slideFloor'"
                                 src="../../imgs/slide-floor.png">
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
                                            v-model="item.name"
                                            style="width: 274px;">
                                        </el-input>
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
                                            v-model="item.titleImg"
                                            style="width: 274px;">
                                        </el-input>
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
                                            v-model="item.activityId"
                                            style="width: 274px;">
                                        </el-input>
                                    </td>
                                </tr>
                            </table>

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

                <!--楼层菜单-->
                <div v-if="curModule && curModule.moduleType == 'floorMenu'">
                    <div class="menu-module"
                         :style="{backgroundColor: curModule.menuBgColor, color: curModule.menuFontColor}">
                        <ul class="oh"
                            :style="{backgroundColor: curModule.menuBgColor, color: curModule.menuFontColor}">
                            <li class="menu-item current"
                                :style="{color: curModule.menuCurColor}">
                                楼层名称A
                                <div class="line"
                                     :style="{backgroundColor: curModule.menuCurColor}">
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

                        <i class="btn icon-font icon-you1"></i>
                    </div>

                    <div class="mt20px f14px cm-text-red">
                        <p class="pb20px">楼层菜单模块需知：</p>
                        <p class="pb20px pl5px pr5px">A. 楼层菜单模块与楼层模块相互关联，前者依赖后者</p>
                        <p class="pb20px pl5px pr5px">B. 如果页面只配置了楼层菜单模块，没配置楼层模块。则楼层菜单也不会展示</p>
                        <p class="pb20px pl5px pr5px">C. 楼层菜单模块中每个菜单的文案取自楼层模块各个楼层的楼层名称，且与之一一对应</p>
                        <p class="pb20px pl5px pr5px">D. 楼层菜单模块的作用仅为点击楼层菜单就跳转到相应的楼层，除此以外的功能菜单，请用常规模块实现</p>
                    </div>
                </div>

                <!--滑动Banner-->
                <div v-if="curModule && curModule.moduleType == 'slideBanner'">
                    <div class="banner-module">
                        <ul :style="{left: curBannerIndex * (-100) + '%'}">
                            <li v-for="(item, $index) in curModule.bannerList"
                                :key="$index">
                                <a :href="item.url">
                                    <div class="placeholder" v-if="!item.img">
                                        <i class="el-icon-picture-outline cm-text-light"
                                           style="font-size: 40px;">
                                        </i>
                                        <p class="f14px lh30px cm-text-light">
                                            请输入Banner图url
                                        </p>
                                    </div>

                                    <img v-else :src="item.img">
                                </a>
                            </li>
                        </ul>
                        <ol>
                            <li v-for="(item, $index) in curModule.bannerList"
                                :key="$index"
                                :class="{current: $index == curBannerIndex}">
                            </li>
                        </ol>
                    </div>

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
                                            v-model="item.img"
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
                                <tr v-if="item.linkType && item.linkType != 'myCoupons' && item.linkType != 'pageTop'">
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
                                                :key="moduleIndex"
                                                :value="moduleIndex"
                                                :label="'模块' + (moduleIndex + 1)">
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

                                        <el-input
                                            v-else
                                            :placeholder="'请输入' + linkTypeValName[item.linkType]"
                                            v-model="item.linkValue"
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

            </div>
        </div>
    </div>
</template>

<script>
    import colorSetter from '../../components/color-setter.vue';
    //模块对象
    var defaultModule = JSON.stringify({
        moduleType: 'simple',
        bgImg: '',
        menuFontColor: '#ffffff',
        menuCurColor: '#f8fb40',
        menuBgColor: '#2a469c',
        linkList: [],
        floorList: [
            {
                name: '',
                titleImg: '',
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
                floorIndex: ''
            }
        ]
    });

    module.exports = {
        components: {
            colorSetter: colorSetter
        },
        data () {
            return {
                pageId: '',
                initFlag: false,
                refreshFlag: false,

                areaName: '',
                pageTitle: '',
                pageBgColor: '#ffffff',
                moduleList: [],

                curModuleIndex: 0,
                curLinkIndex: 0,
                curFloorIndex: 0,
                curBannerIndex: 0,

                linkTypeValName: {
                    goods: '商品ID',
                    activity: '活动ID',
                    packActivity: '活动ID',
                    coupon: '活动ID',
                    module: '跳转模块',
                    floor: '跳转楼层',
                    other: '链接地址'
                },

                letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],

                colorList: [
                    '#e64d21',
                    '#1890FF',
                    '#2FC25B',
                    '#ff9f00',
                    '#422b00',
                    '#690ce0',
                    '#0410c7',
                    '#ff7bcc'
                ]
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
                    module: null,
                    index: -1
                };

                this.moduleList.forEach(function (item, index) {
                    if (item.moduleType == 'floor' || item.moduleType == 'slideFloor') {
                        result.module = item;
                        result.index = index;
                    }
                });

                return result;
            }
        },
        methods: {
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
                            _this.moduleList = setting.moduleList;
                        }

                        _this.$nextTick(function () {
                            _this.initFlag = true;
                        });
                    }
                });
            },

            handleCurPreview (module, moduleIndex, floorIndex) {
                var _this = this;

                _this.curModuleIndex = moduleIndex;

                if (module.moduleType == 'floor' || module.moduleType == 'slideFloor') {
                    _this.curFloorIndex = floorIndex;
                }
            },

            handleAddModule () {
                var _this = this,
                    module = JSON.parse(defaultModule);

                _this.moduleList.push(module);
                _this.curModuleIndex = _this.moduleList.length - 1;
            },
            handleDelModule (e, index) {
                e.stopPropagation();
                var _this = this;

                if (index <= _this.curModuleIndex) {
                    //如果 当前编辑模块 在 删除模块 之前，要把 curModuleIndex 减去1 再删除模块，否则会引发报错
                    //因为删除模块后，当前编辑模块的 index 就比之前小 1 了
                    _this.curModuleIndex--;
                }

                _this.moduleList.splice(index, 1);
            },
            handleCurModule (index) {
                this.curModuleIndex = index;
            },
            handleModuleTypeChange (val) {
                var _this = this;

                if (!_this.initFlag) {
                   return;
                }

                _this.curModule.bgImg = '';
                _this.curModule.linkList = [];
                _this.curModule.floorList = [
                    {
                        name: '',
                        titleImg: '',
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
                        floorIndex: ''
                    }
                ];

                _this.curLinkIndex = 0;
                _this.curFloorIndex = 0;
                _this.curBannerIndex = 0;
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
                    floorIndex: ''
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
                    width: Math.floor(scale * item.width) + 'px',
                    height: Math.floor(scale * item.height) + 'px',
                    left: Math.floor(scale * item.left) + 'px',
                    top: Math.floor(scale * item.top) + 'px',
                    backgroundColor: _this.curLinkIndex == index ? _this.colorList[index] : 'transparent',
                    opacity: _this.curLinkIndex == index ? 0.6 : 1,
                    border: _this.curLinkIndex == index ? 'none' : '1px solid ' + _this.colorList[index],
                    zIndex: _this.curLinkIndex == index ? 2 : 1
                };
            },

            handleAddFloor () {
                var _this = this;

                _this.curModule.floorList.push({
                    name: '',
                    titleImg: '',
                    activityType: '',
                    activityId: ''
                });

                _this.curFloorIndex = _this.curModule.floorList.length - 1;
            },
            handleDelFloor (e, index) {
                e.stopPropagation();
                var _this = this;

                if (index <= _this.curFloorIndex) {
                    //如果 当前编辑模块 在 删除模块 之前，要把 curModuleIndex 减去1 再删除模块，否则会引发报错
                    //因为删除模块后，当前编辑模块的 index 就比之前小 1 了
                    _this.curFloorIndex--;
                }

                _this.curModule.floorList.splice(index, 1);
            },
            handleCurFloor (index) {
                this.curFloorIndex = index;
            },

            handleAddBanner () {
                var _this = this;

                _this.curModule.bannerList.push({
                    img: '',
                    linkType: '',
                    linkValue: ''
                });

                _this.curBannerIndex = _this.curModule.bannerList.length - 1;
            },
            handleDelBanner (e, index) {
                e.stopPropagation();
                var _this = this;

                if (index <= _this.curBannerIndex) {
                    //如果 当前编辑模块 在 删除模块 之前，要把 curModuleIndex 减去1 再删除模块，否则会引发报错
                    //因为删除模块后，当前编辑模块的 index 就比之前小 1 了
                    _this.curBannerIndex--;
                }

                _this.curModule.bannerList.splice(index, 1);
            },
            handleCurBanner (index) {
                this.curBannerIndex = index;
            },

            handleLinkTypeChange () {
                var _this = this,
                    moduleType = _this.curModule.moduleType,
                    list = {
                        simple: 'linkList',
                        slideBanner: 'bannerList'
                    },
                    index = {
                        simple: 'curLinkIndex',
                        slideBanner: 'curBannerIndex'
                    };

                if (!_this.initFlag) {
                    return;
                }

                var targetList = list[moduleType],
                    targetIndex = _this[index[moduleType]],
                    target = _this.curModule[targetList][targetIndex];

                target.linkValue = '';
                target.moduleIndex = '';
                target.floorIndex = '';
            },

            handleSave () {
                var _this = this;

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
                                throw {message: '模块背景图url不能为空'};
                            }

                            module.linkList.forEach(function (link, linkIndex) {
                                var validateWidth = _this.validateNumber(link.width);
                                if (validateWidth) {
                                    throw {message: '链接' + (linkIndex + 1) + '的热区宽度' + validateWidth};
                                }

                                var validateHeight = _this.validateNumber(link.height);
                                if (validateHeight) {
                                    throw {message: '链接' + (linkIndex + 1) + '的热区高度' + validateHeight};
                                }

                                var validateTop = _this.validateNumber(link.top);
                                if (validateTop) {
                                    throw {message: '链接' + (linkIndex + 1) + '的距离上边' + validateTop};
                                }

                                var validateLeft = _this.validateNumber(link.left);
                                if (validateLeft) {
                                    throw {message: '链接' + (linkIndex + 1) + '的距离左边' + validateLeft};
                                }

                                if (link.linkType === '') {
                                    throw {message: '请选择链接' + (linkIndex + 1) + '的链接类型'};
                                }

                                if (link.linkType != 'myCoupons' &&
                                    link.linkType != 'module' &&
                                    link.linkType != 'pageTop' &&
                                    link.linkValue === '') {
                                    var str = '链接' + (linkIndex + 1) +
                                        '的' +
                                        _this.linkTypeValName[link.linkType] +
                                        '不能为空';

                                    throw {message: str};
                                }

                                if (link.linkType == 'module' && link.moduleIndex === '') {
                                    var str = '请选择链接' + (linkIndex + 1) +
                                        '的' +
                                        _this.linkTypeValName[link.linkType];

                                    throw {message: str};
                                }

                                if (link.linkType == 'floor' && link.floorIndex === '') {
                                    var str = '请选择链接' + (linkIndex + 1) +
                                        '的' +
                                        _this.linkTypeValName[link.linkType];

                                    throw {message: str};
                                }
                            });

                        } else if (module.moduleType == 'floor' || module.moduleType == 'slideFloor') {
                            //楼层模块

                            module.floorList.forEach(function (floor, floorIndex) {
                                if (floor.name === '') {
                                    throw {message: '楼层' + (floorIndex + 1) + '的楼层名称不能为空'};
                                }

                                if (floor.titleImg === '') {
                                    throw {message: '楼层' + (floorIndex + 1) + '的标题图片url不能为空'};
                                }

                                if (floor.activityId === '') {
                                    throw {message: '请选择楼层' + (floorIndex + 1) + '的活动类型'};
                                }

                                if (floor.activityId === '') {
                                    throw {message: '楼层' + (floorIndex + 1) + '的活动ID不能为空'};
                                }
                            });

                        } else if (module.moduleType == 'floorMenu') {
                            //楼层菜单模块

                            if (module.menuFontColor === '') {
                                throw {message: '菜单字体颜色不能为空'};
                            }

                            if (module.menuCurColor === '') {
                                throw {message: '高亮字体颜色不能为空'};
                            }

                            if (module.menuBgColor === '') {
                                throw {message: '菜单背景颜色不能为空'};
                            }

                        } else if (module.moduleType == 'slideBanner') {
                            //滑动banner模块

                            module.bannerList.forEach(function (banner, bannerIndex) {
                                if (module.img === '') {
                                    throw {message: 'Banner' + (bannerIndex + 1) + '的图片url不能为空'};
                                }

                                if (banner.linkType === '') {
                                    throw {message: '请选择Banner' + (bannerIndex + 1) + '的链接类型'};
                                }

                                if (banner.linkType != 'myCoupons' &&
                                    banner.linkType != 'module' &&
                                    banner.linkType != 'pageTop' &&
                                    banner.linkValue === '') {
                                    var str = 'Banner' + (bannerIndex + 1) +
                                        '的' +
                                        _this.linkTypeValName[banner.linkType] +
                                        '不能为空';

                                    throw {message: str};
                                }

                                if (banner.linkType == 'module' && banner.moduleIndex === '') {
                                    var str = '请选择Banner' + (bannerIndex + 1) +
                                        '的' +
                                        _this.linkTypeValName[banner.linkType];

                                    throw {message: str};
                                }

                                if (banner.linkType == 'fllor' && banner.floorIndex === '') {
                                    var str = '请选择Banner' + (bannerIndex + 1) +
                                        '的' +
                                        _this.linkTypeValName[banner.linkType];

                                    throw {message: str};
                                }
                            });

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

            handleRefresh () {
                this.refreshFlag = !this.refreshFlag;
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

<style scoped>
    .main-wrap{
        overflow: hidden;
        width: 1195px;
        margin: 0 auto;
        position: relative;
        padding: 30px 0;
    }
    .main-wrap:before{
        content: '';
        position: absolute;
        left: 347px;
        top: 20px;
        bottom: 20px;
        border-left: 1px dashed #c8e0ee;
    }
    .main-wrap:after{
        content: '';
        position: absolute;
        right: 432px;
        top: 20px;
        bottom: 20px;
        border-left: 1px dashed #c8e0ee;
    }
    .preview-wrap{
        width: 320px;
        margin-right: 55px;
        float: left;
    }
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

    .module-manage-wrap{
        float: left;
        margin-right: 55px;
        width: 360px;
    }
    .module-item{
        border: 1px solid #c9e4ff;
        background-color: #e6f0fa;
        padding: 15px 20px;
        border-radius: 6px;
        position: relative;
        margin-bottom: 10px;
        box-shadow: 2px 2px 5px #cccccc;
    }
    .module-item-close{
        height: 52px;
        overflow: hidden;
        border: 1px solid #e2e2e2;
        background-color: #fafafa;
    }
    .module-item .btn{
        font-size: 14px;
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: 50%;
        position: absolute;
        top: 13px;
        right: 18px;
        color: #e20000;
    }
    .module-item-add{
        border: 1px solid #e2e2e2;
        background-color: #409eff;
        color: #ffffff;
        border-radius: 6px;
        position: relative;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
    }
    .module-item-add:hover{
        border-color: #20a0ff;
        color: #20a0ff;
    }

    .module-view-wrap{
        float: left;
        width: 400px;
    }
    .simple-module{
        position: relative;
        font-size: 0;
        border: 1px solid #f0f0f0;
    }
    .simple-module .placeholder{
        height: 200px;
        text-align: center;
        padding-top: 40px;
    }
    .simple-module img{
        width: 100%;
    }
    .simple-module .link-area{
        position: absolute;
        box-sizing: border-box;
    }
    .preview-wrap .simple-module{
        border: none;
    }
    .preview-wrap .simple-module .placeholder{
        height: 144px;
        padding-top: 29px;
        border-bottom: 1px dashed #e2e2e2;
        background-color: #ffffff;
    }

    .sub-list-item{
        border: 1px solid #c9e4ff;
        background-color: #e6f0fa;
        padding: 15px 20px;
        border-radius: 6px;
        position: relative;
        margin-bottom: 10px;
        box-shadow: 2px 2px 5px #cccccc;
    }
    .sub-list-item-close{
        height: 52px;
        overflow: hidden;
        border: 1px solid #e2e2e2;
        background-color: #fafafa;
    }
    .sub-list-item .title{
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 20px;
    }
    .sub-list-item .btn{
        font-size: 14px;
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: 50%;
        position: absolute;
        top: 13px;
        right: 18px;
        color: #e20000;
    }
    .sub-list-item .btn.is-disabled{
        color: #c0c4cc;
        cursor: not-allowed;
        background-image: none;
        background-color: #fff;
        border-color: #ebeef5;
    }
    .sub-list-item .color-block{
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #e2e2e2;
        vertical-align: middle;
        position: relative;
        top: -2px;
    }

    .floor-module{
        position: relative;
        font-size: 0;
        border: 1px solid #f0f0f0;
        text-align: center;
        margin: 0 auto;
    }
    .floor-module .placeholder{
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-bottom: 1px dashed #f0f0f0;
    }
    .floor-module img{
        width: 100%;
    }
    .preview-wrap .floor-module{
        border: none;
    }
    .preview-wrap .floor-module .placeholder{
        height: 36px;
        line-height: 36px;
        border-bottom: 1px dashed #e2e2e2;
        background-color: #ffffff;
    }

    .banner-module{
        height: 143px;
        position: relative;
        font-size: 0;
        border: 1px solid #f0f0f0;
        text-align: center;
        overflow: hidden;
    }
    .banner-module .placeholder{
        height: 143px;
        text-align: center;
        padding-top: 30px;
        border-bottom: 1px dashed #e2e2e2;
    }
    .banner-module ul{
        position: absolute;
        top: 0;
        left: 0;
        width: 400%;
        height: 100%;
        transition: left 0.3s;
    }
    .banner-module ul li{
        float: left;
        width: 25%;
        height: 100%;
    }
    .banner-module ul li a{
        display: block;
        height: 100%;
    }
    .banner-module ul li a img{
        display: block;
        height: 100%;
        width: 100%;
    }
    .banner-module ol{
        position: absolute;
        bottom: 13px;
        left: 50%;
        -webkit-transform: translateX(-50%);
        -moz-transform: translateX(-50%);
        -ms-transform: translateX(-50%);
        -o-transform: translateX(-50%);
        transform: translateX(-50%);
    }
    .banner-module ol li{
        float: left;
        margin: 0 6px;
        border-radius: 50%;
        width: 9px;
        height: 9px;
        background-color: #ffffff;
        box-shadow: 0 0 2px #999999;
    }
    .banner-module ol li.current {
        background-color: #ff3333;
    }
    .preview-wrap .banner-module{
        border: none;
        height: 103px;
    }
    .preview-wrap .banner-module .placeholder{
        height: 103px;
        padding-top: 22px;
        background-color: #ffffff;
    }
    .preview-wrap .banner-module ol{
        bottom: 9px;
    }
    .preview-wrap .banner-module ol li{
        margin: 0 4px;
        width: 6px;
        height: 6px;
    }

    .menu-module{
        position: relative;
        padding-right: 32px;
    }
    .menu-module .btn{
        width: 32px;
        height: 44px;
        line-height: 44px;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        font-size: 22px;
    }
    .menu-module .menu-item{
        height: 44px;
        line-height: 44px;
        font-size: 18px;
        float: left;
        padding: 0 12px;
        text-align:center;
        position: relative;
    }
    .menu-module .current{
        color: #ff3333;
    }
    .menu-module .line{
        display: none;
    }
    .menu-module .current .line{
        display: block;
        position: absolute;
        left: 9px;
        right: 9px;
        bottom: 0;
        height: 2px;
        background-color: #ff3333;
        overflow: hidden;
    }
    .preview-wrap .menu-module{
        padding-right: 23px;
        margin-bottom: 4px;
    }
    .preview-wrap .menu-module .btn{
        width: 23px;
        height: 32px;
        line-height: 32px;
        font-size: 16px;
    }
    .preview-wrap .menu-item{
        height: 32px;
        line-height: 32px;
        font-size: 13px;
        padding: 0 9px;
    }
    .preview-wrap .menu-module .current .line{
        left: 6px;
        right: 6px;
        height: 1px;
        overflow: hidden;
    }

    .no-data{
        border: 1px dashed #e2e2e2;
        background-color: #fcfcfc;
        color: #9c9c9c;
        text-align: center;
        line-height: 80px;
        font-size: 14px;
        margin-bottom: 10px;
        border-radius: 6px;
    }
</style>
