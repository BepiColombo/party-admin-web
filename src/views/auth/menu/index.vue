<template>
  <div class="role-container">
    <!-- 筛选-操作区域 -->
    <div class="filter-wrapper">
      <div class="action-wrapper">
        <!-- <el-button type="primary" icon="el-icon-plus" @click="onFilterSubmit"
          >新增</el-button
        > -->
      </div>
    </div>

    <!-- 表格数据区域 -->
    <el-card class="table-wrapper">
      <div slot="header" class="clearfix">
        <span>菜单列表</span>
      </div>
      <el-table
        :data="data"
        v-loading="isLoading"
        row-key="menuId"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="menuName" label="菜单名称" align="center">
        </el-table-column>
        <el-table-column prop="url" label="菜单前端路由" align="center">
        </el-table-column>
        <el-table-column prop="perms" label="菜单权限标识" align="center">
        </el-table-column>
        <el-table-column prop="perms" label="菜单类型" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.menuType == 1">目录</el-tag>
            <el-tag type="primary" v-if="scope.row.menuType == 2">菜单</el-tag>
            <el-tag type="warning" v-if="scope.row.menuType == 3"
              >操作/按钮</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { parseTime } from "@/utils";
import { translateDataToTree } from "@/utils/tree";
import { GetMenuList } from "@/api/roleMenu";
export default {
  name: "Menu",
  data() {
    return {
      filterForm: {},
      isLoading: false,
      data: [],
      isDialogShow: false
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
        const res = await GetMenuList();
        this.data = translateDataToTree(res.data, "menuId");
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-container {
  .filter-wrapper {
    .filter-form {
    }
  }
}
</style>
