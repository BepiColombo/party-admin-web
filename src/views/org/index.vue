<template>
  <div class="org-container">
    <div class="filter-wratter">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            placeholder="请输入关键词搜索"
            class="keyword-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="getData"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <div class="action-wrapper">
        <el-button type="primary" icon="el-icon-plus" @click="addClick"
          >新增</el-button
        >
      </div>
    </div>

    <!-- 表格数据区域 -->
    <el-card class="table-wrapper">
      <div slot="header" class="clearfix">
        <span>组织列表</span>
      </div>
      <el-table
        :data="data"
        size="small"
        v-loading="isLoading"
        row-key="orgId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="orgName" label="组织名称"> </el-table-column>
        <el-table-column prop="orgId" label="组织ID"> </el-table-column>
        <el-table-column prop="orgAddress" label="组织地址"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="rowEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="rowDelete(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialogType == 'add' ? '新增组织' : '编辑组织信息'"
      :visible.sync="isDialogShow"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form :model="editForm" class="edit-form">
        <el-form-item label="上级组织" v-if="dialogType == 'add'">
          <treeselect
            v-model="editForm.parentId"
            :options="treeSelectData"
            placeholder="选择上级组织"
          />
        </el-form-item>
        <el-form-item label="组织名称">
          <el-input
            v-model="editForm.orgName"
            placeholder="请输入组织名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="组织地址">
          <el-input
            type="textarea"
            v-model="editForm.orgAddress"
            placeholder="请输入组织地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { translateDataToTree } from "@/utils/tree";
import { GetOrgList, DeleteOrg, UpdateOrg, AddOrg } from "@/api/org";
export default {
  name: "Org",
  components: { Treeselect },
  data() {
    return {
      isLoading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      data: [],
      filterForm: {},
      isDialogShow: false,
      editForm: {},
      dialogType: "add",
      treeSelectData: [],
      rules: {
        orgName: [
          {
            required: true,
            message: "请输入组织名称",
            trigger: "blur"
          }
        ],
        orgAddress: [
          {
            required: true,
            message: "请输入组织地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  computed: {},

  methods: {
    async getData() {
      this.isLoading = true;
      try {
        const res = await GetOrgList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          keyword: this.filterForm.keyword
        });
        let orgList = res.data.list;

        this.data = translateDataToTree(orgList, "orgId");
        let _orgList = orgList.reduce((p, v) => {
          p.push({
            id: v.orgId,
            label: v.orgName,
            parentId: v.parentId
          });
          return p;
        }, []);
        this.treeSelectData = translateDataToTree(_orgList, "id");
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    onPageChange(val) {
      this.pageNum = val;
      this.getData();
    },
    addClick() {
      this.isDialogShow = true;
      this.dialogType = "add";
    },
    rowEdit(row) {
      this.isDialogShow = true;
      this.dialogType = "edit";

      this.$nextTick(() => {
        this.editForm = {
          ...row
        };
      });
    },

    async submit() {
      this.isLoading = true;
      try {
        let res;
        if (this.dialogType == "add") {
          res = await AddOrg(this.editForm);
        } else {
          res = await UpdateOrg(this.editForm);
        }
        if (res.code == 200) {
          this.$message.success("操作成功");
          this.getData();
          this.isDialogShow = false;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    rowDelete(row) {
      this.$confirm("此操作将删除该组织, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.isLoading = true;
          try {
            const res = await DeleteOrg({ orgId: row.orgId });
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getData();
            }
          } catch (e) {
            console.error(e);
          } finally {
            this.isLoading = false;
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.org-container {
  .filter-wrapper {
    .filter-form {
      .keyword-input {
        width: 200px;
      }
      .roleType-sel {
        width: 138px;
      }
      .datePicker {
        width: 200px;
      }
    }
  }
  .edit-form {
    width: 400px;
    margin: auto;
  }
}
</style>
