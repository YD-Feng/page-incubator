<template>
    <div class="cm-inner-page">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
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
                        v-model.trim="form.activity_name"
                        placeholder="请输入项目名称"
                        class="form-input-width">
                    </el-input>
                </el-form-item>

                <el-form-item class="pl10px">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="default" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="oh">
            <el-button
                class="mb10px"
                type="primary"
                @click="openDialog()">
                创建活动
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
                label="页面目录"
                prop="folder"
                min-width="180">
            </el-table-column>

            <el-table-column
                label="活动描述"
                min-width="270">
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
                        @click="goToManagePage(scope.row)">
                        管理页面
                    </el-button>

                    <el-button
                        size="small"
                        type="success"
                        @click="openDialog(scope.row)">
                        编辑
                    </el-button>

                    <el-button
                        type="danger"
                        size="small"
                        @click="handleDelActivity(scope.$index, scope.row)">
                        删除
                    </el-button>
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
                :page-size="form.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog
            title="创建活动"
            :visible.sync="dialog.visible"
            custom-class="activity-dialog-500px">
            <div class="pl20px pr20px pt10px">
                <table width="100%">
                    <tr>
                        <td width="70"
                            class="text-right f12px lh30px">
                            活动名称
                        </td>
                        <td valign="top" class="pl10px">
                            <el-input
                                placeholder="请输入活动名称"
                                v-model.trim="dialog.activity_name"
                                style="width: 300px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td width="70"
                            class="text-right f12px lh30px pt10px">
                            页面目录
                        </td>
                        <td valign="top" class="pl10px pt10px">
                            <el-input
                                placeholder="请输入页面目录"
                                v-model.trim="dialog.folder"
                                style="width: 300px;">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td width="70"
                            valign="top"
                            class="text-right pt10px f12px lh30px">
                            活动描述
                        </td>
                        <td valign="top" class="pl10px pt10px">
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入活动描述"
                                v-model.trim="dialog.activity_desc"
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
        data () {
            return {
                pickerOptions: {
                    shortcuts: utils.pickerOptShortcuts
                },

                form: {
                    start_time: undefined,
                    end_time: undefined,
                    activity_name: '',
                    page: 1,
                    page_size: 10
                },

                list: [],
                total: 0,

                dialog: {
                    visible: false,
                    activity_id: '',
                    activity_name: '',
                    folder: '',
                    activity_desc: ''
                }
            }
        },
        methods: {
            search () {
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
            handleSizeChange (val) {
                var _this = this;
                _this.form.page_size = val;
                _this.form.page = 1;
                _this.search();
            },
            handleCurrentChange (val) {
                var _this = this;
                _this.form.page = val;
                _this.search();
            },
            handleReset () {
                this.$refs.form.resetFields();
            },

            handleDelActivity (index, row) {
                var _this = this;

                _this.$confirm('删除活动的同时，会把活动相关的所有页面删除，请问确定要删除此活动吗？', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'cm-confirm-box',
                    type: 'warning'
                }).then(function () {
                    _this.doDelActivity(index, row);
                }, function () {});
            },
            doDelActivity (index, row) {
                var _this = this;

                _this.$post({
                    url: '/activity/del',
                    data: {
                        activity_id: row.activity_id
                    },
                    success: function (res) {
                        _this.$message.success('删除成功');
                        _this.form.page = 1;
                        _this.search();
                    }
                });
            },

            openDialog (row) {
                var _this = this;
                _this.dialog.visible = true;
                _this.dialog.activity_id = row ? row.activity_id : '';
                _this.dialog.activity_name = row ? row.activity_name : '';
                _this.dialog.folder = row ? row.folder : '';
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
                        throw {message: '活动名称不能为空'};
                    } else if (_this.dialog.activity_name.length > 15) {
                        throw {message: '活动名称不能超过15个字符'};
                    }

                    if (_this.dialog.folder === '') {
                        throw {message: '页面目录不能为空'};
                    }

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                _this.$post({
                    url: url,
                    data: {
                        activity_id: _this.dialog.activity_id,
                        activity_name: _this.dialog.activity_name,
                        folder: _this.dialog.folder,
                        activity_desc: _this.dialog.activity_desc
                    },
                    success: function (res) {
                        _this.$message.success('保存成功');
                        _this.form.page = 1;
                        _this.search();
                        _this.closeDialog();
                    }
                });
            },

            goToManagePage (row) {
                this.$router.push({
                    path: '/activityPageList/' + row.activity_id
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
