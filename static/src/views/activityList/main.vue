<template>
    <div class="cm-inner-page">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>bug-center</el-breadcrumb-item>
            <el-breadcrumb-item>项目列表</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="cm-form-inline">
            <el-form class="search-form"
                     :inline="true"
                     :model="form"
                     ref="form"
                     label-width="70px">
                <el-form-item label="创建时间" prop="startTime" style="margin-right: 0;">
                    <div style="font-size: 0;">
                        <el-date-picker
                            v-model="form.startTime"
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

                <el-form-item label="" label-width="0px" prop="endTime">
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        :editable="false"
                        :picker-options="pickerOptions"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择结束时间"
                        class="form-input-width">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="项目名称" prop="title">
                    <el-input
                        v-model="form.title"
                        placeholder="请输入项目名称"
                        class="form-input-width">
                    </el-input>
                </el-form-item>

                <el-form-item label="项目状态" prop="status">
                    <el-select
                        v-model="form.status"
                        placeholder="全部"
                        class="form-input-width">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未开始" value="notStarted"></el-option>
                        <el-option label="进行中" value="hasStarted"></el-option>
                        <el-option label="已结束" value="over"></el-option>
                        <el-option label="已停用" value="stop"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="pl10px">
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="success" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="oh">
            <el-button class="mb5px" type="info" @click="goToDetail('add')">新建项目</el-button>
        </div>
        <!--列表-->
        <el-table
            :data="list"
            border
            style="width: 100%;">
            <el-table-column
                label="序号"
                type="index"
                width="60"
                align="center">
            </el-table-column>

            <el-table-column
                label="项目名称"
                prop="title"
                min-width="200">
            </el-table-column>

            <el-table-column
                label="项目状态"
                min-width="100"
                align="center">
                <template scope="scope">{{scope.row | transStatus}}</template>
            </el-table-column>

            <el-table-column
                label="创建时间"
                prop="createTime"
                min-width="150"
                align="center">
            </el-table-column>

            <el-table-column
                label="项目描述"
                prop="desc"
                min-width="350">
            </el-table-column>

            <el-table-column
                label="操作"
                min-width="140"
                align="center">
                <template scope="scope">

                    <el-button
                        size="small"
                        type="primary"
                        @click="goToTaskList(scope.row)"
                        class="mr5px">
                        查看任务
                    </el-button>

                    <el-button
                        size="small"
                        type="primary"
                        @click="goToDetail('edit', scope.row.activityId)"
                        class="mr5px">
                        编辑
                    </el-button>

                    <el-popover :ref="'p' + scope.$index" placement="top">
                        <p class="lh40px pt5px pb5px">
                            <i class="el-icon-information cm-text-orange mr5px"></i>
                            <span v-if="scope.row.status == 0">请问确定要启动项目吗？</span>
                            <span v-if="scope.row.status == 1">请问确定要结束项目吗？</span>
                        </p>
                        <div class="text-center">
                            <el-button type="primary" size="small" @click="doUpdateStatus(scope.$index, scope.row)">确定</el-button>
                            <el-button type="warning" size="small" @click="hidePop(scope.$index)">取消</el-button>
                        </div>

                        <el-button
                            :type="scope.row.status == 1 ? 'warning' : 'success'"
                            size="small"
                            slot="reference">
                            {{scope.row.status == 1 ? '结束' : '启动'}}
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
    </div>
</template>

<script>
    import utils from 'utils';

    module.exports = {
        props: ['activityType'],
        data: function () {
            return {
                pickerOptions: {
                    shortcuts: utils.pickerOptShortcuts
                },

                form: {
                    startTime: null,
                    endTime: null,
                    title: '',
                    status: '',
                    page: 1,
                    pageSize: 10
                },

                list: [],
                total: 0
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

                if (params.startDate) {
                    params.startDate = params.startDate.format('yyyy-MM-dd HH:mm:ss');
                }

                if (params.endDate) {
                    params.endDate = params.endDate.format('yyyy-MM-dd HH:mm:ss');
                }

                params.activityType = _this.activityType;

                _this.$post({
                    url: '',
                    data: params,
                    success: function (res) {

                        _this.list = res.data;
                        _this.total = res.total;

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
                this.$refs['form'].resetFields();
            },
            //隐藏启用、停用提示框
            hidePop: function (index) {
                this.$refs['p' + index].doClose();
            },
            goToTaskList: function (project) {
                var _this = this;
                _this.$router.push({
                    path: '/main/task-list/' + project.id
                });
            }
        },
        filters: {
            transStatus: function (activity) {
                //状态
                var now = new Date().format('yyyy-MM-dd HH:mm:ss'),
                    status = activity.status,
                    startDate = activity.startDate,
                    endDate = activity.endDate;

                if (status == 'disable') {
                    return '已停用';
                } else if (startDate <= now && now <= endDate) {
                    return '进行中';
                } else if (now > endDate) {
                    return '已结束';
                } else if (now < startDate) {
                    return '未开始';
                }

                return '未知';
            }
        },
        created: function () {
            var _this = this;
            //_this.search();
        }
    }
</script>

<style scoped>
    .form-input-width{
        width: 150px;
    }
</style>

<style>
    .pl-dialog-600{
        width: 600px;
    }
</style>
