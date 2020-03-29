<template>
  <div class="article-container">
    <h2>文章列表</h2>
    <el-form :inline="true" :model="queryForm" class="filter-form">
      <el-form-item>
        <el-input
          v-model="queryForm.keyword"
          placeholder="请输入关键词搜索"
          class="keyword-input"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-search" @click="getData"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="onAddArticleClick"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <div class="article-list-box">
      <el-card class="article-item" v-for="(i, k) in data" :key="k">
        <!-- <el-image
          class="thumbnail"
          lazy
          :src="i.articleThumbnail"
          fit="cover"
          :preview-src-list="[]"
        ></el-image> -->
        <img :src="i.articleThumbnail" class="thumbnail" alt="" />
        <div class="intro">
          <span class="title">{{ i.articleTitle }}</span>
          <div class="bottom clearfix">
            <time class="time">{{ i.createTime }}</time>
            <el-button
              type="text"
              class="button"
              @click="onViewDetailClick(i.articleId)"
              >查看详情</el-button
            >
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { parseTime, throttle } from "@/utils";
import { GetArticleList } from "@/api/article";
export default {
  name: "Article",
  data() {
    return {
      isLoading: false,
      pageSize: 10,
      pageNum: 1,
      total: 0,
      data: [],
      hasMore: true,
      queryForm: {
        startTime: null,
        endTime: null,
        keyword: ""
      }
    };
  },
  created() {},
  mounted() {
    this.getData();
    this.scroll();
  },
  computed: {},

  methods: {
    scroll() {
      window.onscroll = throttle(() => {
        let bottomOfWindow =
          document.documentElement.clientHeight +
            document.documentElement.scrollTop >=
          document.documentElement.scrollHeight;
        if (bottomOfWindow) {
          this.pageNum++;
          this.getData();
        }
      });
    },
    async getData() {
      if (!this.hasMore) return;
      this.isLoading = true;
      try {
        const res = await GetArticleList({
          ...this.queryForm,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        });
        if (res.data.list.length == 0) {
          this.hasMore = false;
        }
        if (this.pageNum == 1) {
          this.data = res.data.list;
        } else {
          this.data = this.data.concat(res.data.list);
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    onViewDetailClick(articleId) {
      this.$router.push({
        path: "/article/article_detail",
        query: {
          articleId
        }
      });
    },
    onAddArticleClick() {
      this.$router.push({
        path: "/article/article_edit",
        query: { type: "add" }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-container {
  .filter-form {
    display: flex;
    justify-content: center;
    .keyword-input {
      width: 400px;
    }
  }
  .article-list-box {
    margin: 20px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .article-item {
      width: 280px;
      margin-right: 15px;
      margin-top: 8px;
      .thumbnail {
        height: 320px;
        width: 240px;
      }
      .intro {
        width: 240px;
        margin-top: 8px;
        .title {
          font-size: 15px;
        }
        .bottom {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          .time {
            font-size: 13px;
            color: #999;
            margin-top: 3px;
          }
        }
      }
    }
  }
}
</style>
