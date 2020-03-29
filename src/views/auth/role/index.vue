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
            <el-select
              v-model="cur_role"
              placeholder="请选择角色"
              class="role-selector"
            >
              <el-option
                v-for="item in data"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
            <el-button
              v-permission="perms.roleMenuAdd"
              style="float: right"
              type="primary"
              icon="el-icon-check"
              @click="menuSubmit"
              >保存</el-button
            >
          </div>
          <el-tree
            v-loading="isMenuTreeLoading"
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

    <el-dialog
      title="新增角色"
      :visible.sync="isDialogShow"
      @close="addCancel"
      class="add-dialog"
      :close-on-click-modal="false"
    >
      <el-steps
        :space="200"
        :active="stepNum"
        :align-center="true"
        class="steps"
      >
        <el-step title="角色信息"></el-step>
        <el-step title="分配菜单"></el-step>
      </el-steps>
      <transition name="fade-transform" mode="out-in">
        <el-form
          :model="addForm"
          class="add-form"
          :rules="rules"
          ref="addForm"
          v-if="stepNum == 1"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input
              v-model="addForm.roleName"
              placeholder="请输入角色名"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDescription">
            <el-input
              v-model="addForm.roleDescription"
              placeholder="请输入角色描述"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-tree
          v-else
          :data="menuList"
          :props="props"
          show-checkbox
          node-key="menuId"
          ref="roleAddMenuTree"
        >
        </el-tree>
      </transition>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel">取 消</el-button>
        <el-button type="primary" @click="addNext">下一步</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑角色"
      :visible.sync="isEditDialogShow"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" class="edit-form">
        <el-form-item label="角色名">
          <el-input
            v-model="editForm.roleName"
            placeholder="请输入角色名"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="editForm.roleDescription"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditDialogShow = false">取 消</el-button>
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
  GetMenuList,
  GetMenusOfRole,
  UpdateRoleMenus
} from "@/api/roleMenu";
export default {
  name: "Role",
  components: {},
  data() {
    return {
      isLoading: false,
      isMenuTreeLoading: false,
      data: [],
      isDialogShow: false,
      isEditDialogShow: false,
      editForm: {},
      addForm: {},
      stepNum: 1,
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名",
            trigger: "blur"
          }
        ],
        roleDescription: [
          {
            required: true,
            message: "请输入角色描述",
            trigger: "blur"
          }
        ]
      },
      perms: {
        roleMenuAdd: ["role:menu:batch"]
      },
      cur_role: null,
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
  watch: {
    async cur_role(val) {
      this.isMenuTreeLoading = true;

      try {
        const res = await GetMenusOfRole({ roleId: val });
        const menu_ids = res.data.reduce((p, v) => {
          p.push(v.menuId);
          return p;
        }, []);
        this.$refs.menuTree.setCheckedKeys(menu_ids);
      } catch (error) {
        console.log(error);
      } finally {
        this.isMenuTreeLoading = false;
      }
    }
  },
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
    async menuSubmit() {
      const keys = this.$refs.menuTree.getCheckedKeys();
      if (this.cur_role === null || this.cur_role === undefined) {
        this.$message.warning("请先选择角色");
        return;
      }
      const res = await UpdateRoleMenus({ ids: keys, roleId: this.cur_role });
      if (res.code == 200) {
        this.$message.success("分配成功");
      } else {
        this.$message.warning("分配失败");
      }
    },
    rowEdit(row) {
      this.isEditDialogShow = true;
      this.$nextTick(() => {
        this.editForm = {
          ...row
        };
      });
    },
    async addNext() {
      if (this.stepNum == 1) {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.stepNum++;
          }
        });
      } else {
        const selectKeys = this.$refs.roleAddMenuTree.getCheckedKeys();
        const res = await AddRole({
          roleName: this.addForm.roleName,
          roleDescription: this.addForm.roleDescription,
          menuIds: selectKeys.toString()
        });
        if (res.code == 200) {
          this.$message.success("添加成功");
          //清空状态
          this.addCancel();
          this.getData();
        } else {
          this.$message.warning(res.msg);
        }
      }
    },
    addCancel() {
      this.isDialogShow = false;
      this.stepNum = 1;
      this.addForm = {};
      this.$refs.addForm.resetFields();
    },
    async editSubmit() {
      this.isLoading = true;
      try {
        const res = await UpdateRole(this.editForm);
        if (res.code == 200) {
          this.$message.success("更新成功");
          this.getData();
          this.isEditDialogShow = false;
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
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.isLoading = true;
          try {
            const res = await DeleteRoleById(row.roleId);
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
  .role-selector {
    margin-left: 10px;
    width: 160px;
  }

  .add-dialog {
    width: 1000px;
    margin: auto;
    .steps {
      margin-bottom: 20px;
    }
    /deep/ .el-dialog__body {
      min-height: 350px;
    }
  }
}
</style>
