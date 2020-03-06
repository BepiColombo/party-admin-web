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
            v-model="filterForm.roleType"
            placeholder="请选择角色类型"
            class="roleType-sel"
          >
            <el-option label="用户" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="超级管理员" :value="3"></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="onFilterSubmit"
          >新增</el-button
        >
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
        <el-table-column prop="idcard" label="身份证号"> </el-table-column>
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
              @click="rowEdit(scope)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="rowDelete(scope)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import { GetUserList } from "@/api/user";
export default {
  name: "User",
  components: {},
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
      data: []
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  computed: {},
  methods: {
    async getData() {
      console.log(this.filterForm);
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
      } finally {
        this.isLoading = false;
      }
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
      console.log(row);
    },
    rowDelete(row) {
      console.log(row);
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
}
</style>
