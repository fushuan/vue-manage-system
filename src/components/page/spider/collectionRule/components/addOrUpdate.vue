<template>
  <div>
      <el-dialog :title="dialog_title" :visible.sync="dialogFormVisible">
          <el-row>
            <el-col :span="8">
                <el-card>
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
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card>
                    <el-form :model="form" label-position="left" label-width="200px" >
                        <el-form-item label="采集规则描述">
                            <el-input v-model="form.name" style="width:200px" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网站id">
                            <el-input disabled v-model="form.websiteId" style="width:200px" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网站名">
                            <el-input disabled v-model="form.websiteName" style="width:200px" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="网址">
                            <el-input disabled v-model="form.url" style="width:200px" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="采集内容类型" >
                            <el-select v-model="form.contentType" placeholder="请选择采集内容类型">
                                <el-option label="文本" value="1"></el-option>
                                <el-option label="图片" value="2"></el-option>
                                <el-option label="视频" value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采集选择器类型" >
                            <el-select v-model="form.selectorType" placeholder="请选择采集选择器类型">
                                <el-option label="css" value="1"></el-option>
                                <el-option label="xpath" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择器表达式">
                            <el-input v-model="form.selectorContent" style="width:250px" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="采集测试">
                            <el-radio-group v-model="form.selectorContent">
                                <el-row>
                                    <el-col>
                                        <el-checkbox label="保存前测试" name="type"></el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row style="margin-top: 5px;">
                                    <el-col>
                                        <el-radio label="动态页面"></el-radio>
                                        <el-radio label="静态页面"></el-radio>
                                    </el-col>
                                </el-row>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
          </el-row>


          <div slot="footer" class="dialog-footer">
              <el-button @click="handleCancel">取 消</el-button>
              <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import { addCollectionRule } from '../../../../../request/spider/collectionRule';
    import {getWebsiteTree} from '../../../../../request/spider/website';

    export default {
        data() {
        return {
            data: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            filterText: '',
            dialog_title: '',
            dialogFormVisible: false,
            form: {
                name: undefined,
                websiteId: undefined,
                websiteName: undefined,
                contentType: undefined,
                selectorType: undefined,
                selectorContent: undefined,
            }
        }
        },
        created() {
          this.getWebsiteTree();
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },
        methods: {
            getWebsiteTree() {
                getWebsiteTree(this.form).then(response => {
                  const data = response.data;
                  this.data = data.result;
                });
            },
            handleNodeClick(row) {
                this.form.websiteId = row.id;
                this.form.websiteName = row.name;
            },
            filterNode(value, data) {
              if (!value) return true;
              return data.name.indexOf(value) !== -1;
            },
            showDialog() {

              this.dialog_title = "新增";
              this.dialogFormVisible = true;
            },
            handleSubmit() {
                alert(JSON.stringify(this.form))
                addCollectionRule(this.form).then(response => {
                    /*const data = response.data;
                    this.data = data.result;*/
                    this.$notify({
                        title: "新增",
                        message: "新增采集规则成功",
                        type: "success",
                        duration: 2000
                    });
                    this.dialogFormVisible = false;
                    //this.$emit('refresh');
                });
            },
            handleCancel() {
                this.dialogFormVisible = false;
            }

        }
    }
</script>

