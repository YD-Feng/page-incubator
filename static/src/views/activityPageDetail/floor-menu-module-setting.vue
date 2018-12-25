<template>
    <div v-if="curModule">
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

            <i class="btn icon-font icon-xia"></i>
        </div>

        <table style="width: 100%;" class="mt20px f14px">
            <tr>
                <td class="pb10px lh30px">
                    菜单字体颜色：
                    <color-setter
                        v-model="curModule.menuFontColor"
                        :colorListVisible="false"
                        style="display: inline-block">
                    </color-setter>
                </td>
            </tr>

            <tr>
                <td class="pb10px lh30px">
                    高亮字体颜色：
                    <color-setter
                        v-model="curModule.menuCurColor"
                        :colorListVisible="false"
                        style="display: inline-block">
                    </color-setter>
                </td>
            </tr>

            <tr>
                <td class="pb10px lh30px">
                    菜单背景颜色：
                    <color-setter
                        v-model="curModule.menuBgColor"
                        :colorListVisible="false"
                        style="display: inline-block">
                    </color-setter>
                </td>
            </tr>
        </table>

        <div class="mt20px f14px cm-text-red">
            <p class="pb20px">楼层菜单模块需知：</p>
            <p class="pb20px pl5px pr5px">A. 楼层菜单模块与楼层模块相互关联，前者依赖后者</p>
            <p class="pb20px pl5px pr5px">B. 如果页面只配置了楼层菜单模块，没配置楼层模块。则楼层菜单也不会展示</p>
            <p class="pb20px pl5px pr5px">C. 楼层菜单模块中每个菜单的文案取自楼层模块各个楼层的楼层名称，且与之一一对应</p>
            <p class="pb20px pl5px pr5px">D. 楼层菜单模块的作用仅为点击楼层菜单就跳转到相应的楼层，除此以外的功能菜单，请用常规模块实现</p>
        </div>
    </div>
</template>

<script>
    import colorSetter from '../../components/color-setter.vue';

    module.exports = {
        components: {
            colorSetter: colorSetter
        },
        replace: true,
        data () {
            return {
                curModule: null,

                initFlag: false
            };
        },
        watch: {
            'curModule.menuFontColor': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.menuCurColor': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            },
            'curModule.menuBgColor': function () {
                if (this.initFlag) {
                    this.$emit('moduleChange');
                }
            }
        },
        methods: {
            setData (curModule) {
                var _this = this;
                _this.curModule = curModule;

                _this.$nextTick(function () {
                    _this.initFlag = true;
                });
            },

            getData () {
                return JSON.parse(JSON.stringify(this.curModule));
            }
        }
    };
</script>
