<template>
  <div>
      <el-dialog :title="dialog_title" :visible.sync="dialogFormVisible">
          <el-form :model="form" label-width="200px">
              <el-row>
                  <el-col :span="10">
                      <el-form-item label="父网址id">
                          <el-input disabled v-model="form.parentId" style="width:200px" autocomplete="off"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="父网址名称">
                          <el-input disabled v-model="form.parentName" style="width:200px" autocomplete="off"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="10">
                      <el-form-item label="网址">
                          <el-input v-model="form.url" style="width:250px" autocomplete="off"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="名称" >
                          <el-input v-model="form.name" style="width:200px" autocomplete="off"></el-input>
                      </el-form-item>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col>
                      <el-form-item label="类型" >
                          <el-select v-model="form.type" placeholder="请选择类型">
                              <el-option label="主页" value="1"></el-option>
                              <el-option label="子页" value="2"></el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col>

                  </el-col>
              </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="handleCancel">取 消</el-button>
              <el-button type="primary" @click="handleSubmit">确 定</el-button>
          </div>
      </el-dialog>
  </div>
</template>

<script>

import {addWebsite, editWebsite } from '../../../../../request/spider/website';

export default {
  name: 'element',

  data() {
    return {
        dialog_title: '',
        dialogFormVisible: false,
        form: {
            parentId: undefined,
            parentName: undefined,
            url: undefined,
            name: undefined,
            type: undefined,
        }
    }
  },
  created() {
  },
  methods: {
      showDialog(parentId, parentName) {
          if (parentId == null) {
              this.form.parentId = 0;
          }
          if (parentName == null) {
              this.form.parentName = "根";
          }
          this.form.parentId = parentId;
          this.form.parentName = parentName;

          this.dialog_title = "新增";
          this.dialogFormVisible = true;
      },
      handleSubmit() {
          addWebsite(this.form).then(response => {
              const data = response.data;
              this.data = data.result;
              this.$notify({
                  title: "新增",
                  message: "新增网址成功",
                  type: "success",
                  duration: 2000
              });
              this.dialogFormVisible = false;
              this.$emit('refresh');

          });

      },
      handleCancel() {
          this.dialogFormVisible = false;
      }

  }
}
</script>
