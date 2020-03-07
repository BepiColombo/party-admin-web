<template>
  <div class="user-container">
    <!-- 筛选-操作区域 -->
    <div class="filter-wrapper">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item>
          <el-input
            v-model="filterForm.keyword"
            placeholder="请输入手机号或用户名或昵称搜索"
            class="keyword-input"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-select
            clearable
            @visible-change="getRoleListData"
            v-model="filterForm.roleType"
            placeholder="请选择角色类型"
            class="roleType-sel"
          >
            <el-option
              v-for="item in roleOptionList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            class="datePicker"
            v-model="filterForm.birthday"
            type="daterange"
            placeholder="请选择注册日期范围"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="filterDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="getData"
            >搜索</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-refresh"
            @click="onFilterReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <div class="action-wrapper">
        <!-- <el-button type="primary" icon="el-icon-plus" @click="onFilterSubmit"
          >新增</el-button
        > -->
      </div>
    </div>

    <!-- 表格数据区域 -->
    <el-card class="table-wrapper">
      <el-table :data="data" size="small" v-loading="isLoading">
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="role.roleName" label="角色"> </el-table-column>
        <el-table-column prop="org.orgName" label="所属组织"> </el-table-column>
        <el-table-column prop="phone" label="手机号"> </el-table-column>
        <el-table-column prop="nickname" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别" :formatter="sexFormat">
        </el-table-column>
        <el-table-column prop="birthday" label="生日" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="isValid" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isValid == 1">
              正常
            </el-tag>
            <el-tag type="danger" v-if="scope.row.isValid == 0">
              禁用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :formatter="dateYearFormat"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          :formatter="dateYearFormat"
        >
        </el-table-column>
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
      <Pagination
        :total="total"
        :page-size="pageSize"
        :page-num="pageNum"
        @sizeChange="onSizeChange"
        @pageChange="onPageChange"
      />
    </el-card>

    <el-dialog title="编辑用户信息" :visible.sync="isDialogShow">
      <el-form :model="userEditForm" class="edit-form">
        <el-form-item label="昵称">
          {{ userEditForm.nickname }}
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="userEditForm.isValid" :label="1">启用</el-radio>
          <el-radio v-model="userEditForm.isValid" :label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            @visible-change="getRoleListData"
            v-model="userEditForm.role.roleId"
            clearable
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in roleOptionList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
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
import Pagination from "@/components/Pagination";
import { GetRoleList } from "@/api/role";
import { GetUserList, DeleteUser, UpdateUser } from "@/api/user";
export default {
  name: "User",
  components: { Pagination },
  data() {
    return {
      filterForm: {
        keyword: "",
        roleType: null,
        start_time: null,
        end_time: null
      },
      isLoading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      data: [],
      isDialogShow: false,
      userEditForm: {
        role: {}
      },
      roleOptionList: []
    };
  },
  created() {},
  mounted() {
    this.getData();
    this.getRoleListData();
  },
  computed: {},
  methods: {
    async getData() {
      this.isLoading = true;
      try {
        const res = await GetUserList({
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          keyword: this.filterForm.keyword,
          roleType: this.filterForm.roleType,
          startTime: this.filterForm.start_time,
          endTime: this.filterForm.end_time
        });
        this.data = res.data.list;
        this.total = res.data.total;
      } finally {
        this.isLoading = false;
      }
    },
    async getRoleListData() {
      const res = await GetRoleList();
      this.roleOptionList = res.data;
    },
    onSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    onPageChange(val) {
      this.pageNum = val;
      this.getData();
    },
    filterDateChange(val) {
      this.filterForm.start_time = parseTime(val[0], `{y}-{m}-{d}`);
      this.filterForm.end_time = parseTime(val[1], `{y}-{m}-{d}`);
    },
    onFilterSubmit() {},
    onFilterReset() {
      this.filterForm = Object.keys(this.filterForm).reduce((p, v) => {
        p[v] = null;
        return p;
      }, {});
    },
    rowEdit(row) {
      this.isDialogShow = true;
      this.$nextTick(() => {
        this.userEditForm = {
          ...row
        };
      });
    },
    async editSubmit() {
      this.isLoading = true;
      try {
        const res = await UpdateUser(this.userEditForm);
        if (res.code == 200) {
          this.$message.success("更新成功");
          this.isDialogShow = false;
        } else {
          this.$message.warning("更新失败");
        }
      } catch (error) {
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
            const res = await DeleteUser(row.userId);
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
.user-container {
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
