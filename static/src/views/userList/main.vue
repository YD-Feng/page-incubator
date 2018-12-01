<template>
    <div class="cm-inner-page">
        <div class="cm-back-btn-wrap">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

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

                <el-form-item label="用户名" prop="user_name">
                    <el-input
                        v-model.trim="form.user_name"
                        placeholder="请输入用户名"
                        class="form-input-width">
                    </el-input>
                </el-form-item>

                <el-form-item label="用户昵称" prop="nick_name">
                    <el-input
                        v-model.trim="form.nick_name"
                        placeholder="请输入用户昵称"
                        class="form-input-width">
                    </el-input>
                </el-form-item>

                <el-form-item label="用户分组" prop="group_id">
                    <el-select
                        v-model="form.group_id"
                        placeholder="请选择用户分组"
                        class="form-input-width">
                        <el-option
                            v-for="item in userGroupList"
                            :key="item.group_id"
                            :value="item.group_id"
                            :label="item.group_name">
                        </el-option>
                    </el-select>
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
                @click="openGroupDialog()">
                分组管理
            </el-button>

            <el-button
                class="mb10px"
                type="success"
                @click="openUserDialog()">
                创建用户
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
                label="用户名"
                prop="user_name"
                min-width="100"
                align="center">
            </el-table-column>

            <el-table-column
                label="用户昵称"
                prop="nick_name"
                min-width="170"
                align="center">
            </el-table-column>

            <el-table-column
                label="用户分组"
                min-width="120"
                align="center">
                <template slot-scope="scope">
                    {{scope.row.group_name}}
                </template>
            </el-table-column>

            <el-table-column
                prop="create_time"
                label="创建时间"
                min-width="170"
                align="center">
            </el-table-column>

            <el-table-column
                label="操作"
                width="220"
                align="center">
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="primary"
                        @click="openUserDialog(scope.row)"
                        class="ml5px">
                        编辑
                    </el-button>

                    <el-popover :ref="'p' + scope.$index" placement="top">
                        <p class="lh40px pt5px pb5px">
                            <i class="el-icon-information cm-text-orange mr5px"></i>
                            请问确定要删除此用户吗？
                        </p>
                        <div class="text-center">
                            <el-button type="primary" size="small" @click="handleDelUser(scope.$index, scope.row)">确定</el-button>
                            <el-button type="warning" size="small" @click="hidePop(scope.$index)">取消</el-button>
                        </div>

                        <el-button
                            :disabled="userInfo.user_id == scope.row.user_id"
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
            :title="userDialog.title"
            :visible.sync="userDialog.visible"
            custom-class="user-dialog-300px">
            <div class="pl10px pr10px">
                <table width="100%">
                    <tr>
                        <td width="80" class="text-right pb10px">
                            用户名：
                        </td>
                        <td class="pb10px">
                            <el-input
                                v-model.trim="userDialog.user_name"
                                placeholder="请输入用户名"
                                class="form-input-width">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right pb10px">
                            密　码：
                        </td>
                        <td class="pb10px">
                            <el-input
                                v-model.trim="userDialog.password"
                                placeholder="请输入用户密码(非必填)"
                                class="form-input-width">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right pb10px">
                            昵　称：
                        </td>
                        <td class="pb10px">
                            <el-input
                                v-model.trim="userDialog.nick_name"
                                placeholder="请输入用户昵称"
                                class="form-input-width">
                            </el-input>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-right pb10px">
                            分　组：
                        </td>
                        <td class="pb10px">
                            <el-select
                                v-model="userDialog.group_id"
                                placeholder="请选择用户分组"
                                class="form-input-width">
                                <el-option
                                    v-for="item in userGroupList"
                                    :key="item.group_id"
                                    :value="item.group_id"
                                    :label="item.group_name">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                </table>

                <div class="text-center pt10px">
                    <el-button
                        type="primary"
                        style="width: 60px;"
                        @click="handleSaveUser">
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
            title="分组管理"
            :visible.sync="groupDialog.visible"
            custom-class="user-group-dialog-500px">
            <!--列表-->
            <el-table
                ref="groupTable"
                :data="groupDialog.groupList"
                max-height="400"
                border>
                <el-table-column
                    label="分组名称"
                    min-width="135"
                    align="center">
                    <template slot-scope="scope">
                        <el-input
                            v-if="scope.row.is_edit"
                            v-model.trim="scope.row.group_name_sp"
                            style="width: 100px;">
                        </el-input>

                        <span v-else class="lh30px">
                            {{scope.row.group_name}}
                        </span>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="create_time"
                    label="创建时间"
                    min-width="170"
                    align="center">
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="120"
                    align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            v-if="scope.row.is_edit"
                            @click="handleSaveGroup(scope.row)">
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
                            :disabled="hasEditGroup"
                            @click="handleEdit(scope.row)">
                            编辑
                        </el-button>

                        <el-button
                            type="text"
                            v-if="!scope.row.is_edit"
                            :disabled="hasEditGroup"
                            @click="handleDelGroup(scope.row, scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pt10px">
                <el-button
                    :disabled="hasEditGroup"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="handleAddGroup">
                    添加分组
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import utils from 'utils';
    import Sha256 from 'js-sha256';

    module.exports = {
        data () {
            return {
                pickerOptions: {
                    shortcuts: utils.pickerOptShortcuts
                },

                form: {
                    start_time: undefined,
                    end_time: undefined,
                    user_name: '',
                    nick_name: '',
                    group_id: '',
                    page: 1,
                    page_size: 10
                },

                list: [],
                total: 0,

                userDialog: {
                    visible: false,
                    title: '新增用户',
                    user_id: '',
                    user_name: '',
                    password: '',
                    nick_name: '',
                    group_id: ''
                },

                groupDialog: {
                    visible: false,
                    groupList: []
                }
            }
        },
        computed: {
            userInfo () {
                return this.$store.state.user.userInfo;
            },
            userGroupList () {
                return this.$store.state.user.userGroupList;
            },
            userGroupData () {
                var obj = {};

                this.$store.state.user.userGroupList.forEach(function (item) {
                    obj[item.group_id] = item;
                });

                return obj;
            },
            hasEditGroup () {
                var arr = this.groupDialog.groupList.filter(function (item) {
                    return item.is_edit;
                });

                return arr.length != 0;
            }
        },
        methods: {
            search () {
                var _this = this;

                _this.$get({
                    url: '/user/getUserList',
                    data: {
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

            //隐藏启用、停用提示框
            hidePop (index) {
                this.$refs['p' + index].doClose();
            },
            handleDelUser (index, row) {
                var _this = this;

                _this.$post({
                    url: '/user/del',
                    data: {
                        user_id: row.user_id
                    },
                    success: function (res) {
                        _this.$message.success('删除成功');
                        _this.hidePop(index);
                        _this.form.page = 1;
                        _this.search();
                    }
                });
            },

            openGroupDialog () {
                var _this = this;

                _this.groupDialog.visible = true;

                _this.$nextTick(function () {
                    _this.groupDialog.groupList = _this.userGroupList.map(function (item) {
                        var obj = Object.assign({}, item);
                        obj.group_name_sp = obj.group_name;
                        obj.is_edit = false;
                        return obj;
                    });
                });
            },
            openUserDialog (row) {
                var _this = this;

                _this.userDialog.visible = true;
                _this.userDialog.title = row ? '编辑用户' : '创建用户';
                _this.userDialog.user_id = row ? row.user_id : '';
                _this.userDialog.user_name = row ? row.user_name : '';
                _this.userDialog.password = '';
                _this.userDialog.nick_name = row ? row.nick_name : '';
                _this.userDialog.group_id = row ? row.group_id : '';
            },
            closeDialog () {
                this.userDialog.visible = false;
                this.groupDialog.visible = false;
            },

            handleEdit (row) {
                row.is_edit = true;
            },
            handleAddGroup () {
                this.groupDialog.groupList.unshift({
                    group_id: '',
                    group_name: '',
                    group_name_sp: '',
                    is_edit: true
                });

                this.$refs.groupTable.$refs.bodyWrapper.scrollTop = 0;
            },
            handleDelGroup (row, index) {
                var _this = this;

                _this.$confirm('确定要删除此分组？删除分组的同时会把 【全部此分组下的用户】 删除，请谨慎操作！！', '系统提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'cm-confirm-box',
                    type: 'warning'
                }).then(function () {
                    _this.doDelGroup(row, index);
                }, function () {});
            },
            doDelGroup (row, index) {
                var _this = this;

                _this.$post({
                    url: '/user/delUserGroup',
                    data: {
                        group_id: row.group_id
                    },
                    success: function (res) {
                        _this.$message.success('删除成功');
                        _this.groupDialog.groupList.splice(index, 1);
                        //操作完成后，重新获取区域列表，并 set 到 store 中
                        _this.getUserGroupList();
                        _this.form.page = 1;
                        _this.search();
                    }
                });
            },
            handleSaveGroup (row) {
                var _this = this;

                try {

                    if (row.group_name_sp === '') {
                        throw {message: '请输入分组名称'};
                    } else if (row.group_name_sp.length > 10) {
                        throw {message: '分组名称最多只能输入10个字符'};
                    }

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                _this.$post({
                    url: row.group_id ? '/user/updateUserGroup' : '/user/addUserGroup',
                    data: {
                        group_id: row.group_id,
                        group_name: row.group_name_sp,
                    },
                    success: function (res) {
                        _this.$message.success('保存成功');

                        row.is_edit = false;
                        row.group_name = row.group_name_sp;
                        row.create_time = new Date().format('yyyy-MM-dd HH:mm:ss');
                        if (!row.group_id) {
                            row.group_id = res.data.insertId;
                        }

                        //操作完成后，重新获取区域列表，并 set 到 store 中
                        _this.getUserGroupList();
                    }
                });
            },
            handleCancel (row, index) {
                var _this = this;

                if (row.group_id) {
                    row.is_edit = false;
                    row.group_name_sp = row.group_name;
                } else {
                    _this.groupDialog.groupList.splice(index, 1);
                }
            },
            getUserGroupList () {
                var _this = this;

                _this.$get({
                    url: '/user/getUserGroupList',
                    success: function (res) {
                        _this.$store.commit('setUserGroupList', res.data);
                    }
                });
            },

            handleSaveUser () {
                var _this = this;

                try {

                    if (_this.userDialog.user_name === '') {
                        throw {message: '请输入用户名'};
                    } else if (_this.userDialog.user_name.length > 10) {
                        throw {message: '用户名最多只能输入10个字符'};
                    }

                    if (_this.userDialog.user_id === '' && _this.userDialog.password === '') {
                        //新增用户，需要输入用户密码
                        throw {message: '请输入密码'};
                    }

                    if (_this.userDialog.password !== '' && _this.userDialog.password.length > 20) {
                        throw {message: '密码最多只能输入20个字符'};
                    }

                    if (_this.userDialog.nick_name === '') {
                        throw {message: '请输入用户昵称'};
                    } else if (_this.userDialog.nick_name.length > 10) {
                        throw {message: '用户昵称最多只能输入10个字符'};
                    }

                    if (_this.userDialog.group_id === '') {
                        throw {message: '请选择用户分组'};
                    }

                } catch (err) {
                    _this.$message.error(err.message);
                    return;
                }

                var param = {
                    user_id: _this.userDialog.user_id,
                    user_name: _this.userDialog.user_name,
                    nick_name: _this.userDialog.nick_name,
                    group_id: _this.userDialog.group_id,
                };

                if (_this.userDialog.password !== '') {
                    param.password = Sha256(_this.userDialog.password);
                }

                _this.$post({
                    url: _this.userDialog.user_id ? '/user/update' : '/user/add',
                    data: param,
                    success: function (res) {
                        if (param.user_id == _this.userInfo.user_id) {
                            _this.$message.success('保存成功，当前用户的信息被修改，需要重新登录系统');
                            _this.logout();
                        } else {
                            _this.$message.success('保存成功');
                            _this.form.page = 1;
                            _this.search();
                            _this.closeDialog();
                        }
                    }
                });
            },

            logout () {
                var _this = this;

                _this.$get({
                    url: '/user/logout',
                    success: function (res) {
                        _this.$router.push({
                            path: '/login'
                        });
                    }
                });
            },
        },
        created: function () {
            var _this = this;
            _this.search();
        }
    }
</script>

<style scoped>
    .form-input-width{
        width: 140px;
    }
</style>

<style>
    .user-dialog-300px{
        width: 300px;
    }
    .user-group-dialog-500px{
        width: 500px;
    }
    .user-group-dialog-500px .el-input__inner{
        text-align: center;
    }
</style>
