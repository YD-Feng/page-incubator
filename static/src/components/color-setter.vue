<template>
    <div class="color-setter">
        <el-input
            v-model="color"
            placeholder="请输入16进制色值"
            style="width: 120px;"
            class="mr5px"
            maxlength="7"
            :disabled="disabled"
            @blur="colorFormat" >
        </el-input>

        <el-color-picker
            v-model="color"
            color-format="rgb"
            @change="colorChange"
            v-if="!disabled">
        </el-color-picker>

        <div v-show="colorListVisible"
             v-if="!disabled"
             :style="{'display': 'inline-block'}"
             class="ml10px">
            <div class="color-block"
                 v-for="item in colorList"
                 :style="{'background-color': item}"
                 @click="setColor(item)">
            </div>
        </div>
    </div>
</template>

<script>

    /*
     *  【属性】showColorList —— 设置属否显示
     *  【指令】v-model —— 与 vue 框架自带指令表现一致
     * */

    // 将rgb 色值 转化为 十六进制色值
    function colorRGB2Hex (color) {
        var rgb = color.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);

        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }
    // 16进制颜色正则
    var reg = /#([a-f]|[A-F]|[0-9]){3}(([a-f]|[A-F]|[0-9]){3})?\b/;

    module.exports = {
        props: {
            value: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            colorListVisible: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                colorList: ['#155FED', '#F7581B', '#AC17B4', '#F49C22', '#333333', '#ffffff'],
                color: this.value
            }
        },
        watch: {
            value: function (value) {
                this.setColor(value);
            }
        },
        methods: {
            setColor (color) {
                this.color = color;
                this.sendColor();
            },
            colorFormat () {
                var _this = this;
                if (!reg.test(_this.color)) {
                    _this.color = '#333333';
                    _this.$message.warning('请输入正确的十六进制色值');
                }
                _this.sendColor();
            },
            colorChange (color) {
                if (color) {
                    this.color = colorRGB2Hex(color);
                }
                this.sendColor();
            },
            sendColor () {
                this.$emit('input', this.color);
            }
        }
    }
</script>

<style>
    .color-setter .el-color-picker {
        vertical-align: bottom;
        height: 30px;
    }
    .color-setter .el-color-picker__trigger {
        height: 30px;
        padding-top: 3px;
        background-color: #ffffff;
    }
    .color-setter .color-block {
        border:1px solid #ccc;
        height: 28px;
        width: 28px;
        display: inline-block;
        vertical-align: bottom;
        margin-left:2px;
        cursor: pointer;
    }
</style>
