<template>
    <div class="cm-inner-page">
        <div class="cm-back-btn-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动页面</el-breadcrumb-item>
            </el-breadcrumb>

            <el-button
                class="btn-back"
                type="default"
                @click="goBack">
                返回&nbsp;&gt;&gt;
            </el-button>
        </div>

        <div class="oh">
            <el-button
                v-if="userInfo.group_id == 1"
                class="mb10px"
                type="primary"
                @click="openAreaDialog()">
                区域管理
            </el-button>

            <el-button
                class="mb10px"
                type="success"
                @click="openPageDialog()">
                创建页面
            </el-button>

            <el-button
                class="mb10px"
                type="warning"
                @click="handleExportPage()">
                导出页面文件
            </el-button>

            <div class="fr lh40px f14px">
                活动：<span class="fBold cm-text-blue">{{activity.activity_name}}</span>
            </div>
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
                label="所属区域"
                min-width="120"
                align="center">
                <template slot-scope="scope">
                    <span class="f14px fBold cm-text-blue">
                        {{scope.row.area_name}}
                    </span>
                </template>
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
                label="最后维护人"
                prop="last_update_name"
                min-width="100"
                align="center">
            </el-table-column>

            <el-table-column
                label="最后维护时间"
                min-width="170"
                align="center">
                <template slot-scope="scope">
                    {{ scope.row.last_update_time == '0000-00-00 00:00:00' ?
                    scope.row.create_time :
                    scope.row.last_update_time }}
                </template>
            </el-table-column>

            <el-table-column
                label="操作"
                width="220"
                align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="primary"
                        @click="goToDetail(scope.row)"
                        class="ml5px">
                        编辑
                    </el-button>

                    <el-button
                        size="small"
                        type="success"
                        @click="openPageDialog(scope.row)"
                        class="ml5px">
                        克隆页面
                    </el-button>

                    <el-popover :ref="'p' + scope.$index" placement="top">
                        <p class="lh40px pt5px pb5px">
                            <i class="el-icon-warning cm-text-orange mr5px"></i>
                            请问确定要删除此页面吗？
                        </p>
                        <div class="text-center">
                            <el-button type="primary" size="small" @click="handleDelPage(scope.$index, scope.row)">确定</el-button>
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
            :title="pageDialog.title"
            :visible.sync="pageDialog.visible"
            custom-class="activity-page-dialog-300px">
            <div class="pl20px pr20px pt10px">
                <table width="100%">
                    <tr v-if="pageDialog.area_name">
                        <td colspan="2" class="text-center pb20px">
                            准备把【<span class="cm-text-blue fBold">{{pageDialog.area_name}}</span>】的页面克隆到...
                        </td>
                    </tr>
                    <tr>
                        <td width="50"
                            class="text-right f12px lh30px">
                            区域
                        </td>
                        <td valign="top" class="pl10px">
                            <el-select
                                v-model="pageDialog.area_id"
                                placeholder="请选择所属区域"
                                style="width: 130px;">
                                <el-option
                                    v-for="item in areaList"
                                    :key="item.area_id"
                                    :value="item.area_id"
                                    :label="item.area_name">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                </table>

                <div class="text-center pt20px">
                    <el-button
                        type="primary"
                        style="width: 60px;"
                        @click="handleSavePage">
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

        <el-dialog
            title="区域管理"
            :visible.sync="areaDialog.visible"
            custom-class="activity-page-dialog-780px">
            <!--列表-->
            <el-table
                ref="areaTable"
                :data="areaDialog.areaList"
                max-height="400"
                border>
                <el-table-column
                    label="序号"
                    type="index"
                    width="60"
                    align="center">
                </el-table-column>

                <el-table-column
                    label="区域名称"
                    min-width="135"
                    align="center">
                    <template slot-scope="scope">
                        <el-input
                            v-if="scope.row.is_edit"
                            v-model.trim="scope.row.area_name_sp"
                            style="width: 100px;">
                        </el-input>

                        <span v-else class="lh30px">
                            {{scope.row.area_name}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="区域编码"
                    min-width="130"
                    align="center">
                    <template slot-scope="scope">
                        <el-input
                            v-if="scope.row.is_edit"
                            v-model.trim="scope.row.area_code_sp"
                            style="width: 100px;">
                        </el-input>

                        <span v-else class="lh30px">
                            {{scope.row.area_code}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="测试账号"
                    min-width="130"
                    align="center">
                    <template slot-scope="scope">
                        <el-input
                            v-if="scope.row.is_edit"
                            v-model.trim="scope.row.test_user_sp"
                            style="width: 100px;">
                        </el-input>

                        <span v-else class="lh30px">
                            {{scope.row.test_user}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="测试账号密码"
                    min-width="130"
                    align="center">
                    <template slot-scope="scope">
                        <el-input
                            v-if="scope.row.is_edit"
                            v-model.trim="scope.row.test_password_sp"
                            style="width: 100px;">
                        </el-input>

                        <span v-else class="lh30px">
                            {{scope.row.test_password}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="120"
                    align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="scope.row.is_edit"
                            @click="handleSaveArea(scope.row)">
                            保存
                        </el-button>

                        <el-button
                            type="text"
                            v-if="scope.row.is_edit"
                            @click="handleCancel(scope.row, scope.$index)">
                            取消
                        </el-button>

                        <el-button
                            type="text"
                            v-if="!scope.row.is_edit"
                            :disabled="hasEditArea"
                            @click="handleEdit(scope.row)">
                            编辑
                        </el-button>

                        <el-button
                            type="text"
                            v-if="!scope.row.is_edit"
                            :disabled="hasEditArea"
                            @click="handleDelArea(scope.row, scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pt10px">
                <el-button
                    :disabled="hasEditArea"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddArea">
                    添加区域
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import utils from 'utils';

    module.exports = {
        data () {
            return {
                activity: {},

                form: {
                    activity_id: '',
                    page: 1,
                    page_size: 10
                },

                list: [],
                total: 0,

                pageDialog: {
                    visible: false,
                    area_id: '',
                    area_name: '',
                    setting: ''
                },

                areaDialog: {
                    visible: false,
                    areaList: []
                }
            }
        },
        computed: {
            areaList () {
                return this.$store.state.area.areaList;
            },
            hasEditArea () {
                var arr = this.areaDialog.areaList.filter(function (item) {
                    return item.is_edit;
                });

                return arr.length != 0;
            },
            userInfo () {
                return this.$store.state.user.userInfo;
            }
        },
        methods: {
            getActivityDetail () {
                var _this = this;

                _this.$get({
                    url: '/activity/getActivityDetail',
                    data: {
                        activity_id: _this.form.activity_id
                    },
                    success: function (res) {
                        _this.activity = res.data;
                    }
                });
            },

            getPageList () {
                var _this = this;

                _this.$get({
                    url: '/activityPage/getActivityPageList',
                    data: {
                        activity_id: _this.form.activity_id,
                        page: _this.form.page,
                        page_size: _this.form.page_size
                    },
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
                _this.getPageList();
            },
            handleCurrentChange (val) {
                var _this = this;
                _this.form.page = val;
                _this.getPageList();
            },

            //隐藏启用、停用提示框
            hidePop (index) {
                this.$refs['p' + index].doClose();
            },
            handleDelPage (index, row) {
                var _this = this;

                _this.$post({
                    url: '/activityPage/del',
                    data: {
                        page_id: row.page_id
                    },
                    success: function (res) {
                        _this.$message.success('删除成功');
                        _this.hidePop(index);
                        _this.form.page = 1;
                        _this.getPageList();
                    }
                });
            },

            openAreaDialog () {
                var _this = this;

                _this.areaDialog.visible = true;

                _this.$nextTick(function () {
                    _this.areaDialog.areaList = _this.areaList.map(function (item) {
                        var obj = Object.assign({}, item);
                        obj.area_name_sp = obj.area_name;
                        obj.area_code_sp = obj.area_code;
                        obj.test_user_sp = obj.test_user;
                        obj.test_password_sp = obj.test_password;
                        obj.is_edit = false;
                        return obj;
                    });
                });
            },
            openPageDialog (row) {
                var _this = this;

                if (_this.areaList.length == 0) {
                    _this.$message.error('未创建任何区域，无法创建页面');
                    return;
                }

                _this.pageDialog.visible = true;
                _this.pageDialog.area_id = '';
                _this.pageDialog.area_name = row ? row.area_name : '';
                _this.pageDialog.setting = row ? row.setting : '';
                _this.pageDialog.title = row ? '克隆页面到指定区域' : '创建页面'
            },
            closeDialog () {
                this.pageDialog.visible = false;
                this.areaDialog.visible = false;
            },

            handleEdit (row) {
                row.is_edit = true;
            },
            handleAddArea () {
                this.areaDialog.areaList.unshift({
                    area_id: '',
                    area_name: '',
                    area_code: '',
                    test_user: '',
                    test_password: '',
                    area_name_sp: '',
                    area_code_sp: '',
                    test_user_sp: '',
                    test_password_sp: '',
                    is_edit: true
                });

                this.$refs.areaTable.$refs.bodyWrapper.scrollTop = 0;
            },
            handleDelArea (row, index) {
                var _this = this;

                _this.$confirm('确定要删除此区域？删除区域的同时会把 【全部活动里此区域下的页面】 删除，请谨慎操作！！', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'cm-confirm-box',
                    type: 'warning'
                }).then(function () {
                    _this.doDelArea(row, index);
                }, function () {});
            },
            doDelArea (row, index) {
                var _this = this;

                _this.$post({
                    url: '/area/del',
                    data: {
                        area_id: row.area_id
                    },
                    success: function (res) {
                        _this.$message.success('删除成功');
                        _this.areaDialog.areaList.splice(index, 1);
                        //操作完成后，重新获取区域列表，并 set 到 store 中
                        _this.getAreaList();
                        _this.form.page = 1;
                        _this.getPageList();
                    }
                });
            },
            handleSaveArea (row) {
                var _this = this,
                    mobileReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

                try {

                    if (row.area_name_sp === '') {
                        throw {message: '请输入区域名称'};
                    } else if (row.area_name_sp.length > 10) {
                        throw {message: '区域名称最多只能输入10个字符'};
                    }

                    if (row.area_code_sp === '') {
                        throw {message: '请输入区域编码'};
                    } else if (row.area_code_sp.length > 5) {
                        throw {message: '区域编码最多只能输入5个字符'};
                    }

                    if (row.test_user_sp === '') {
                        throw {message: '请输入测试账号'};
                    } else if ( !(mobileReg.test(row.test_user_sp)) ) {
                        throw {message: '无效手机号码'};
                    }

                    if (row.test_password_sp === '') {
                        throw {message: '请输入测试账号密码'};
                    } else if (row.test_password_sp.length > 15) {
                        throw {message: '测试账号密码最多只能输入15个字符'};
                    }

                    let isAddedName = _this.areaList.filter((item) => {
                        return item.area_name == row.area_name_sp;
                    }).length > 0;

                    if (!row.area_id) {
                        //新增区域时要做校验
                        if (isAddedName) {
                            throw {message: '区域名称 ' + row.area_name_sp + ' 已存在列表中，请勿重复添加'};
                        }

                        let isAddedCode = _this.areaList.filter((item) => {
                            return item.area_code == row.area_code_sp;
                        }).length > 0;

                        if (isAddedCode) {
                            throw {message: '区域编码 ' + row.area_code_sp + ' 已使用，不能使用重复的编码'};
                        }
                    }

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                _this.$post({
                    url: row.area_id ? '/area/update' : '/area/add',
                    data: {
                        area_id: row.area_id,
                        area_name: row.area_name_sp,
                        area_code: row.area_code_sp,
                        test_user: row.test_user_sp,
                        test_password: row.test_password_sp,
                    },
                    success: function (res) {
                        _this.$message.success('保存成功');

                        row.is_edit = false;
                        row.area_name = row.area_name_sp;
                        row.area_code = row.area_code_sp;
                        row.test_user = row.test_user_sp;
                        row.test_password = row.test_password_sp;
                        if (!row.area_id) {
                            row.area_id = res.data.insertId;
                        }

                        //操作完成后，重新获取区域列表，并 set 到 store 中
                        _this.getAreaList();
                    }
                });
            },
            handleCancel (row, index) {
                var _this = this;

                if (row.area_id) {
                    row.is_edit = false;
                    row.area_name_sp = row.area_name;
                    row.area_code_sp = row.area_code;
                    row.test_user_sp = row.test_user;
                    row.test_password_sp = row.test_password;
                } else {
                    _this.areaDialog.areaList.splice(index, 1);
                }
            },
            getAreaList () {
                var _this = this;

                _this.$get({
                    url: '/area/getAreaList',
                    success: function (res) {
                        _this.$store.commit('setAreaList', res.data);
                    }
                });
            },

            handleSavePage () {
                var _this = this;

                try {

                    if (_this.pageDialog.area_id === '') {
                        throw {message: '请选择所属区域'};
                    }

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                _this.$post({
                    url: '/activityPage/add',
                    data: {
                        activity_id: _this.form.activity_id,
                        area_id: _this.pageDialog.area_id,
                        setting: _this.pageDialog.setting
                    },
                    success: function (res) {
                        _this.$message.success('保存成功');
                        _this.form.page = 1;
                        _this.getPageList();
                        _this.closeDialog();
                    }
                });
            },

            handleExportPage () {
                var _this = this;

                _this.$exportByForm({
                    method: 'post',
                    url: '/activityPage/export',
                    data: {
                        activity_id: _this.form.activity_id
                    }
                });
            },

            goToDetail (row) {
                this.$router.push({
                    path: '/activityPageDetail/' + row.page_id
                });
            },
            goBack () {
                this.$router.go(-1);
            }
        },
        created: function () {
            var _this = this;
            _this.form.activity_id = _this.$route.params.activityId;
            _this.getActivityDetail();
            _this.getPageList();
        }
    }
</script>

<style scoped>
    .form-input-width{
        width: 150px;
    }
</style>

<style>
    .activity-page-dialog-300px{
        width: 300px;
    }
    .activity-page-dialog-780px{
        width: 780px;
    }
    .activity-page-dialog-780px .el-input__inner{
        text-align: center;
    }
</style>
