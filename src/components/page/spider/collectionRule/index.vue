<template>
    <div>
        <el-row style="margin-left: 10px">
            <div class="filter-container">
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd">
                        新增
                    </el-button>
                </el-button-group>
            </div>
        </el-row>
        <el-row style="margin-top: 10px">
            <el-col  style="margin-left: 10px">
                <el-card class="box-card">
                    <el-form label-position="right" label-width="80px" :model="form"  ref="form">
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="网址名称" prop="id">
                                    <el-input v-model="form.id" placeholder="网址名称" style="width: 200px;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="规则名" prop="id">
                                    <el-input v-model="form.id" placeholder="规则名" style="width: 200px;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-button type="primary" @click="onSubmit">查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-card>
                <el-card class="box-card">
                    <el-table :data="tableData" border class="table" style="width: 100%"  stripe border>
                        <el-table-column
                            prop="id"
                            label="#"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="采集规则描述"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="websiteName"
                            label="网站名"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="contentTypeCn"
                            label="采集内容类型">
                        </el-table-column>
                        <el-table-column
                            prop="selectorTypeCn"
                            label="采集选择器类型">
                        </el-table-column>
                        <el-table-column
                            prop="selectorContent"
                            label="采集选择器">
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
                    <div class="pagination">
                        <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                        </el-pagination>
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage4"
                            :page-sizes="[100, 200, 300, 400]"
                            :page-size="100"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <dialog-addOrUpdate @refresh="refresh" ref="addOrUpdate" :visible.sync="dialogFormVisible"></dialog-addOrUpdate>
    </div>
</template>

<script>
    import {getCollectionRules, addCollectionRule, removeCollectionRule } from '../../../../request/spider/collectionRule';

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
                    parentId: undefined,
                    page: {
                        size: undefined,
                        pageNo: undefined,
                        total: undefined,
                        params: {

                        }
                    }
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
            this.getList();
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getList() {
                getCollectionRules(this.form).then(response => {
                    const data = response.data;
                    this.tableData = data.result;
                });
            },
            refresh() {
                 const datas ={};
                datas.parentId = this.currentId;
                getWebsite(datas).then(response => {
                    const data = response.data;
                    this.tableData = data.result;
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
                this.$refs.addOrUpdate.showDialog();
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
            onSubmit() {

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
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
</style>
