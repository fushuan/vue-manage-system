<template>
    <div>
        <el-row>
            <div class="filter-container">
                <el-button-group>
                    <el-button type="primary" v-if="system_menu_btn_create_status" icon="el-icon-plus" @click="handleAdd">
                        {{system_menu_btn_create_name}}
                    </el-button>
                    <el-button type="primary" v-if="system_menu_btn_update_status" icon="el-icon-edit" @click="handleEdit">
                        {{system_menu_btn_update_name}}
                    </el-button>
                    <el-button type="primary" v-if="system_menu_btn_delete_status" icon="el-icon-delete" @click="handleDelete">
                        {{system_menu_btn_delete_name}}
                    </el-button>
                </el-button-group>
            </div>
        </el-row>
        <el-row style="margin-top: 10px">
            <el-col :span="6">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
                </el-input>
                <el-tree
                    :data="data"
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                    default-expand-all
                    ref="menuTree"
                    :expand-on-click-node="false"
                ></el-tree>
            </el-col>
            <el-col :span="16" style="margin-left: 5px;">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span v-if="formStatus=='create'">菜单信息/{{system_menu_btn_create_name}}</span>
                        <span v-if="formStatus=='update'">菜单信息/{{system_menu_btn_update_name}}</span>
                        <span v-if="formStatus==''">菜单信息</span>
                    </div>
                    <el-form :label-position="right" label-width="80px" :model="form" :rules="rules" ref="form">
                        <el-form-item v-if="formStatus != 'create'" label="序号" prop="id">
                            <el-input v-model="form.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="父节点" prop="parentId">
                            <el-input v-model="form.parentId" :disabled="true" placeholder="请输入父节点"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="type">
                            <el-select class="filter-item" v-model="form.type"  :disabled="formEdit"  placeholder="请输入类型">
                                <el-option v-for="item in typeOptions" :key="item.key" :label="item.name" :value="item.key"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入编码"></el-input>
                        </el-form-item>
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="form.name" :disabled="formEdit" placeholder="请输入名称"></el-input>
                        </el-form-item>
                        <el-form-item label="图标" prop="icon">
                            <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input>
                        </el-form-item>
                        <el-form-item label="路径" prop="path">
                            <el-input v-model="form.path" :disabled="formEdit" placeholder="请输入链接"></el-input>
                        </el-form-item>
                        <el-form-item label="链接" prop="href">
                            <el-input v-model="form.href" :disabled="formEdit" placeholder="请输入链接"></el-input>
                        </el-form-item>
                        <el-form-item label="排序" prop="order">
                            <el-input v-model="form.order" :disabled="formEdit" placeholder="请输入排序"></el-input>
                        </el-form-item>
                        <el-form-item label="描述" prop="description">
                            <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 3, maxRows: 5}" :disabled="formEdit" placeholder="请输入描述"> </el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-select class="filter-item" v-model="form.status" placeholder="请输入状态">
                                <el-option v-for="item in statusOptions" :key="item.key" :label="item.name" :value="item.key"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="formStatus == 'update'">
                            <el-button type="primary" @click="handleUpdate('form')">更新</el-button>
                            <el-button @click="handleCancel">取消</el-button>
                        </el-form-item>
                        <el-form-item v-if="formStatus == 'create'">
                            <el-button type="primary" @click="handleCreate('form')">保存</el-button>
                            <el-button @click="handleCancel">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>页面元素</span>
                    </div>
                    <menu-element :menuId='currentId' ref="menuElement" :visible.sync="showElement"></menu-element>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getMenuTree,addMenu, editMenu, removeMenu } from '../../../request/system/menu/index';

    export default {
        data() {
            return {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                formEdit: true,
                formAdd: true,
                formStatus: '',
                filterText: '',
                form: {
                    id: undefined,
                    parentId: undefined,
                    type: undefined,
                    code: undefined,
                    name: undefined,
                    icon: undefined,
                    path: undefined,
                    href: undefined,
                    order: undefined,
                    description: undefined,
                    status: 1
                },
                system_menu_btn_create_status: true,
                system_menu_btn_update_status: true,
                system_menu_btn_delete_status: true,
                system_menu_btn_create_name: "新增",
                system_menu_btn_update_name: "编辑",
                system_menu_btn_delete_name: "删除",
                statusOptions: [
                    {key: 0, name: '无效'},
                    {key: 1, name: '有效'}
                ],
                typeOptions: [
                    {key: '0', name: '其他'},
                    {key: '10', name: '系统'},
                    {key: '20', name: '客户'},
                    {key: '30', name: '供应商'}
                ],
            };
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        created(){
            // 查询菜单
            this.getTree();
        },
        methods: {
            getTree(){
                getMenuTree().then(response => {
                    const data = response.data;
                    this.data = data.result;
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                this.form = JSON.parse(JSON.stringify(data));
                this.formJsonStr = JSON.stringify(this.form);
                this.currentId = data.id;
                if (this.formStatus == 'create') {
                    this.form.parentId = data.id;
                }
            },
            handleEdit() {
                if (this.form.id) {
                    this.formEdit = false;
                    this.formStatus = 'update';
                }
            },
            handleAdd() {
                this.resetForm();
                this.form.parentId = 0;
                this.formEdit = false;
                this.formStatus = 'create';
            },
            handleDelete() {
                if (this.currentId == 0) {
                    this.$notify({
                        title: "提示",
                        message: "请选择需要删除的菜单",
                        type: "warning",
                        duration: 2000
                    });
                    return;
                }
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeMenu(this.currentId).then(() => {
                        this.getTree();
                        this.resetForm();
                        this.onCancel();
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                    });
                });
            },
            resetForm() {
                this.form = {
                    parentId: this.currentId,
                    type: undefined,
                    code: undefined,
                    name: undefined,
                    icon: undefined,
                    path: undefined,
                    href: undefined,
                    order: undefined,
                    description: undefined,
                    status: 1
                };
            },
            handleUpdate(formName) {
                if(JSON.stringify(this.form) === this.formJsonStr){
                    this.$notify({
                        title: '警告',
                        message: '没有变更则不能提交',
                        type: 'warning',
                        duration: 2000
                    });
                    this.formEdit = true;
                    this.formStatus = '';
                    return false;
                }
                editMenu(this.form).then(() => {
                    this.getTree();
                    this.$notify({
                        title: '成功',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.formEdit = true;
                    this.formStatus = '';

                });
                /*const set = this.$refs;
              set[formName].validate(valid => {
                   if (valid) {
                       update(this.form.id, this.form).then(() => {
                           this.getTree();
                           this.$notify({
                               title: '成功',
                               message: '更新成功',
                               type: 'success',
                               duration: 2000
                           });
                       });
                   }else{
                       return false;
                   }
               });*/
            },
            handleCreate(formName) {
                this.form.id = undefined;
                addMenu(this.form).then(() => {
                    this.getTree();
                    this.$notify({
                        title: '成功',
                        message: '创建成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.formEdit = true;
                    this.formStatus = '';
                });

                /*const set = this.$refs;
                set[formName].validate(valid => {
                    if (valid) {
                        create(this.form).then(() => {
                            this.getTree();
                            this.$notify({
                                title: '成功',
                                message: '创建成功',
                                type: 'success',
                                duration: 2000
                            });
                        });
                    }else{
                        return false;
                    }
                });*/
            },
            handleCancel() {
                this.formEdit = true;
                this.formStatus = '';
            },
        }
    };
</script>
