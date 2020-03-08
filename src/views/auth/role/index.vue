<template>
  <div class="role-container">
    <div class="action-wrapper">
      <el-button type="primary" icon="el-icon-plus" @click="onAddRoleClick"
        >新增</el-button
      >
    </div>

    <el-row :gutter="60">
      <el-col :span="14">
        <!-- 表格数据区域 -->
        <el-card class="table-wrapper">
          <div slot="header" class="clearfix">
            <span>角色列表</span>
          </div>
          <el-table
            :data="data"
            size="small"
            v-loading="isLoading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="roleId" label="角色ID"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDescription" label="角色描述">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="200"
              align="center"
            >
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
      </el-col>
      <el-col :span="10">
        <el-card class="table-wrapper">
          <div slot="header" class="clearfix">
            <span>菜单分配</span>
            <el-button
              style="float: right"
              type="primary"
              icon="el-icon-check"
              @click="menuSubmit"
              >保存</el-button
            >
          </div>
          <el-tree
            :data="menuList"
            :props="props"
            show-checkbox
            node-key="menuId"
            ref="menuTree"
          >
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="编辑角色" :visible.sync="isDialogShow">
      <el-form :model="editForm" class="edit-form">
        <el-form-item label="角色名">
          <el-radio v-model="editForm.isValid" :label="1">启用</el-radio>
          <el-radio v-model="editForm.isValid" :label="0">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import { translateDataToTree } from "@/utils/tree";
import {
  GetRoleList,
  DeleteRoleById,
  UpdateRole,
  AddRole,
  GetMenuList
} from "@/api/roleMenu";
export default {
  name: "Role",
  components: {},
  data() {
    return {
      isLoading: false,
      data: [],
      isDialogShow: false,
      editForm: {},
      props: {
        label: "menuName",
        children: "children"
      },
      menuList: [], //后台请求来的所有的菜单的集合
      selectedRoleList: [] //tabel中被勾选状态的role的集合
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  computed: {},
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },

    async getData() {
      this.isLoading = true;
      try {
        const res = await GetRoleList({
          pageSize: this.pageSize,
          pageNum: this.pageNum
        });
        const menu_res = await GetMenuList();
        this.menuList = translateDataToTree(menu_res.data, "menuId");
        this.data = res.data;
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    handleSelectionChange(val) {
      this.selectedRoleList = val;
    },
    onAddRoleClick() {
      this.isDialogShow = true;
    },
    menuSubmit() {
      const keys = this.$refs.menuTree.getCheckedKeys();
      console.log(keys);
    },
    rowEdit(row) {
      this.isDialogShow = true;
      this.$nextTick(() => {
        this.editForm = {
          ...row
        };
      });
    },
    async editSubmit() {
      this.isLoading = true;
      try {
        const res = await UpdateRole({});
        if (res.code == 200) {
          this.$message.success("更新成功");
          this.getData();
          this.isDialogShow = false;
        } else {
          this.$message.warning("更新失败");
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    rowDelete(row) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.isLoading = true;
          try {
            const res = await DeleteRoleById(row.userId);
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.getData();
            } else {
              this.$message.warning("删除失败");
            }
          } catch (e) {
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
.role-container {
  .edit-form {
    width: 400px;
    margin: auto;
  }
}
</style>
