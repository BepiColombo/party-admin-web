<template>
  <div class="user-container">
    <!-- 筛选-操作区域 -->
    <div class="filter-wrapper">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="手机号">
          <el-input
            v-model="filterForm.account"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="filterForm.name" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.user_class" placeholder="状态">
            <el-option label="用户" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="filterForm.date_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="filterDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="onFilterReset"
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
      <el-table :data="data" size="small">
        <el-table-column prop="date" label="手机号"> </el-table-column>
        <el-table-column prop="name" label="昵称"> </el-table-column>
        <el-table-column prop="address" label="头像"> </el-table-column>
        <el-table-column prop="date" label="余额"> </el-table-column>
        <el-table-column prop="name" label="翠豆余额"> </el-table-column>
        <el-table-column prop="address" label="经验"> </el-table-column>
        <el-table-column prop="date" label="认证状态"> </el-table-column>
        <el-table-column prop="name" label="用户类型"> </el-table-column>
        <el-table-column prop="address" label="上次登录ip"> </el-table-column>
        <el-table-column prop="date" label="上次登录时间"> </el-table-column>
        <el-table-column prop="name" label="注册设备ip"> </el-table-column>
        <el-table-column prop="address" label="创建时间"> </el-table-column>
        <el-table-column prop="address" label="状态"> </el-table-column>
        <el-table-column fixed="right" label="操作">
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
        account: "",
        name: "",
        user_class: 1,
        date_range: null, //*
        start_time: null,
        end_time: null
      },
      data: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created() {},
  mounted() {
    GetUserList().then(res => {
      console.log(res);
    });
  },
  computed: {},
  methods: {
    /**
     * 日期范围选择器change时间，参数为一个数组，包含两个元素：起始时间和结束时间
     */
    filterDateChange(val) {
      this.filterForm.start_time = parseTime(val[0], `{y}-{m}-{d}`);
      this.filterForm.end_time = parseTime(val[1], `{y}-{m}-{d}`);
    },
    //筛选区域表单提交
    onFilterSubmit() {},
    //筛选区域表单重置
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
