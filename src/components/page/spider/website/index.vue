<template>
    <div>
        <el-row>
            <div class="filter-container">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
                        新增
                    </el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="handleDelete">
                        删除
                    </el-button>
                </el-button-group>
            </div>
        </el-row>
        <el-row style="margin-top: 10px">
            <el-col :span="6" >
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
            <el-col :span="16" style="margin-left: 10px">
                <el-card class="box-card">
                    <el-form label-position="right" label-width="80px" :model="form"  ref="form">
                        <!--  <el-form-item v-if="formStatus != 'create'" label="序号" prop="id">
                             <el-input v-model="form.id" disabled></el-input>
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
                         </el-form-item>-->
                    </el-form>
                </el-card>
                <el-card class="box-card">
                    <el-table :data="tableData" style="width: 100%"  stripe border>
                        <!--<el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                        </el-table-column>-->
                        <el-table-column
                            prop="id"
                            label="id"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="网址名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="url"
                            label="网址">
                        </el-table-column>
                        <el-table-column
                            :formatter="dateFormatter"
                            prop="createTime"
                            label="创建时间"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="120">
                            <template slot-scope="scope">
                                <el-button
                                    @click="handleDelete(scope.row)"
                                    type="text"
                                    size="small">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <dialog-addOrUpdate @refresh="refresh" ref="addOrUpdate" :visible.sync="dialogFormVisible"></dialog-addOrUpdate>
    </div>
</template>

<script>
    import {getWebsiteTree, getWebsite, addWebsite, removeWebsite } from '../../../../request/spider/website';

    export default {
        name: "",
        components: {
            'dialog-addOrUpdate': () => import('./components/addOrUpdate')
        },
        data(){
            return{
                dialogFormVisible: false,
                tableData: [],
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                filterText: '',
                form: {
                    id: undefined,
                    parentId: undefined
                },
                currentId: undefined,
                parentId: undefined,
                parentName: undefined,
            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        created(){
            this.getTree();
        },
        methods: {
            refresh() {
                this.getTree()
                const datas ={};
                datas.parentId = this.currentId;
                getWebsite(datas).then(response => {
                    const data = response.data;
                    this.tableData = data.result;
                });
            },
            getTree() {
                getWebsiteTree(this.form).then(response => {
                    const data = response.data;
                    this.data = data.result;
                });
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleNodeClick(row) {
                this.parentId = row.id;
                this.parentName = row.name;
                const datas = {};
                datas.parentId = row.id;
                this.currentId = row.id;
                getWebsite(datas).then(response => {
                    const data = response.data;
                    this.tableData = data.result;
                });
            },
            handleAdd() {
                if (this.parentId == undefined) {
                    this.$notify({
                        title: "提示",
                        message: "请选择一个网址树节点",
                        type: "warning",
                        duration: 2000
                    });
                    return;
                }
                this.$refs.addOrUpdate.showDialog(this.parentId, this.parentName );
            },
            handleDelete(row) {
               /* if (this.currentId == undefined) {
                    this.$notify({
                        title: "提示",
                        message: "请选择需要删除的网址",
                        type: "warning",
                        duration: 2000
                    });
                    return;
                }*/
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeWebsite(row.id).then(() => {
                        this.refresh();
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        });
                    });
                });
            },
            // 日期格式化
            dateFormatter (row, column) {
                let datetime = row.createTime;
                if(datetime){
                    datetime = new Date(datetime);
                    let y = datetime.getFullYear() + '-';
                    let mon = datetime.getMonth()+1 + '-';
                    let d = datetime.getDate();
                    let h =datetime.getHours() + ":";
                    let m =datetime.getMinutes()+ ":";
                    let s =datetime.getSeconds();
                    return y + mon + d + " " + h + m + s;
                }
                return ''
            }
        }
    }
</script>
<style scoped>

</style>
