<!--分页-->
<template>
  <el-pagination
    :page-size.sync="_pageSize"
    :total="total"
    :current-page.sync="_pageNum"
    style="margin-top: 8px;"
    :page-sizes="[10, 15, 20]"
    layout="total, prev, pager, next, sizes"
    @size-change="sizeChangeHandler"
    @current-change="pageChangeHandler"
  />
</template>
<script>
export default {
  props: {
    pageNum: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 10
    },
    total: {
      type: Number,
      required: true
    }
  },
  computed: {
    _pageNum: {
      set(val) {
        this.$emit("update:pageNum", val);
      },
      get() {
        return this.pageNum;
      }
    },
    _pageSize: {
      set(val) {
        this.$emit("update:pageSize", val);
      },
      get() {
        return this.pageSize;
      }
    }
  },
  methods: {
    sizeChangeHandler(val) {
      this.$emit("sizeChange", val);
    },
    pageChangeHandler(val) {
      this.$emit("pageChange", val);
    }
  }
};
</script>
