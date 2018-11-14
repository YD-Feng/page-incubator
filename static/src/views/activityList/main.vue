<template>
    <div class="cm-inner-page">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="cm-form-inline">
            <el-form class="search-form"
                     :inline="true"
                     :model="form"
                     ref="form"
                     label-width="70px">
                <el-form-item label="创建时间" prop="start_time" style="margin-right: 0;">
                    <div style="font-size: 0;">
                        <el-date-picker
                            v-model="form.start_time"
                            type="datetime"
                            :editable="false"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择起始时间"
                            class="form-input-width">
                        </el-date-picker>
                        <span class="pl5px pr5px f12px">-</span>
                    </div>
                </el-form-item>

                <el-form-item label="" label-width="0px" prop="end_time">
                    <el-date-picker
                        v-model="form.end_time"
                        type="datetime"
                        :editable="false"
                        :picker-options="pickerOptions"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束时间"
                        class="form-input-width">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="活动名称" prop="activity_name">
                    <el-input
                        v-model="form.activity_name"
                        placeholder="请输入项目名称"
                        class="form-input-width">
                    </el-input>
                </el-form-item>

                <el-form-item class="pl10px">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="oh">
            <el-button
                class="mb5px"
                type="primary"
                @click="openDialog()">
                添加活动
            </el-button>
        </div>
        <!--列表-->
        <el-table
            :data="list"
            border>
            <el-table-column
                label="序号"
                type="index"
                width="60"
                align="center">
            </el-table-column>

            <el-table-column
                label="活动名称"
                prop="activity_name"
                min-width="200">
            </el-table-column>

            <el-table-column
                label="创建人"
                prop="create_name"
                min-width="100"
                align="center">
            </el-table-column>

            <el-table-column
                label="创建时间"
                prop="create_time"
                min-width="170"
                align="center">
            </el-table-column>

            <el-table-column
                label="活动描述"
                min-width="350">
                <template slot-scope="scope">
                    {{scope.row.activity_desc || '暂无描述'}}
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="primary"
                        @click="goToTaskList(scope.row)">
                        管理页面
                    </el-button>

                    <el-button
                        size="small"
                        type="success"
                        @click="openDialog(scope.row)"
                        class="ml5px">
                        编辑
                    </el-button>

                    <el-popover :ref="'p' + scope.$index" placement="top">
                        <p class="lh40px pt5px pb5px">
                            <i class="el-icon-information cm-text-orange mr5px"></i>
                            请问确定要删除活动吗？
                        </p>
                        <div class="text-center">
                            <el-button type="primary" size="small" @click="doUpdateStatus(scope.$index, scope.row)">确定</el-button>
                            <el-button type="warning" size="small" @click="hidePop(scope.$index)">取消</el-button>
                        </div>

                        <el-button
                            type="danger"
                            size="small"
                            slot="reference"
                            class="ml5px">
                            删除
                        </el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <div class="text-center pt10px pb10px">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="form.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog
            title="添加活动"
            :visible.sync="dialog.visible"
            custom-class="activity-dialog-500px">
            <div class="pl20px pr20px pt10px">
                <table width="100%">
                    <tr>
                        <td width="70"
                            class="text-right f12px">
                            活动名称
                        </td>
                        <td class="pl10px">
                            <el-input
                                placeholder="请输入活动名称"
                                v-model="dialog.activity_name"
                                style="width: 300px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td width="70"
                            class="text-right pt10px f12px">
                            活动描述
                        </td>
                        <td class="pl10px pt10px">
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入活动描述"
                                v-model="dialog.activity_desc"
                                style="width: 300px;">
                            </el-input>
                        </td>
                    </tr>
                </table>

                <div class="text-center pt20px">
                    <el-button
                        type="primary"
                        style="width: 60px;"
                        @click="handleSave">
                        保存
                    </el-button>
                    <el-button
                        type="success"
                        style="width: 60px;"
                        @click="closeDialog">
                        取消
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import utils from 'utils';

    module.exports = {
        data: function () {
            return {
                pickerOptions: {
                    shortcuts: utils.pickerOptShortcuts
                },

                form: {
                    start_time: undefined,
                    end_time: undefined,
                    activity_name: '',
                    page: 1,
                    pageSize: 10
                },

                list: [],
                total: 0,

                dialog: {
                    visible: false,
                    activity_id: '',
                    activity_name: '',
                    activity_desc: ''
                }
            }
        },
        computed: {
            dict: function () {
                return this.$store.state.dict.activity;
            }
        },
        watch: {
            refreshListFlag: function () {
                this.search();
            }
        },
        methods: {
            search: function () {
                var _this = this,
                    params = Object.assign({}, _this.form);

                for (var key in params) {
                    if (params[key] == '' || params[key] == null) {
                        delete params[key];
                    }
                }

                if (params.start_time) {
                    params.start_time = params.start_time.format('yyyy-MM-dd HH:mm:ss');
                }

                if (params.end_time) {
                    params.end_time = params.end_time.format('yyyy-MM-dd HH:mm:ss');
                }

                _this.$get({
                    url: '/activity/getActivityList',
                    data: params,
                    success: function (res) {
                        _this.list = res.data.list;
                        _this.total = res.data.total;
                    }
                });
            },
            handleSizeChange: function (val) {
                var _this = this;
                _this.form.pageSize = val;
                _this.form.page = 1;
                _this.search();
            },
            handleCurrentChange: function (val) {
                var _this = this;
                _this.form.page = val;
                _this.search();
            },
            handleReset: function () {
                this.$refs.form.resetFields();
            },

            //隐藏启用、停用提示框
            hidePop: function (index) {
                this.$refs['p' + index].doClose();
            },

            openDialog (row) {
                var _this = this;
                _this.dialog.visible = true;
                _this.dialog.activity_id = row ? row.activity_id : '';
                _this.dialog.activity_name = row ? row.activity_name : '';
                _this.dialog.activity_desc = row ? row.activity_desc : '';
            },
            closeDialog () {
                this.dialog.visible = false;
            },
            handleSave () {
                var _this = this,
                    url = _this.dialog.activity_id ? '/activity/update' : '/activity/add';

                try {

                    if (_this.dialog.activity_name === '') {
                        throw '活动名称不能为空';
                    }

                } catch (msg) {
                    _this.$message.error(msg);
                    return;
                }

                _this.$post({
                    url: url,
                    data: {
                        activity_id: _this.dialog.activity_id,
                        activity_name: _this.dialog.activity_name,
                        activity_desc: _this.dialog.activity_desc
                    },
                    success: function (res) {
                        _this.$message.success('保存成功');
                        _this.form.page = 1;
                        _this.search();
                        _this.closeDialog();
                    }
                });
            }
        },
        created: function () {
            var _this = this;
            _this.search();
        }
    }
</script>

<style scoped>
    .form-input-width{
        width: 150px;
    }
</style>

<style>
    .activity-dialog-500px{
        width: 500px;
    }
</style>
