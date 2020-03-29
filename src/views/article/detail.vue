<template>
  <div class="article-detail">
    <el-card class="box">
      <div slot="header" class="clearfix">
        <el-button
          style="float:right"
          type="primary"
          @click="onEditClick"
          v-permission="perms.articleEdit"
        >
          编辑</el-button
        >
      </div>
      <h2>{{ article.articleTitle }}</h2>
      <h3 class="author grey-text">作者：{{ article.articleAuthor }}</h3>
      <h3 class="create-time grey-text">发表于：{{ article.createTime }}</h3>
      <h3 class="update-time grey-text">更新于：{{ article.updateTime }}</h3>
      <el-divider></el-divider>
      <div class="content" v-html="article.articleContent"></div>
    </el-card>
  </div>
</template>

<script>
import { GetArticleById } from "@/api/article";
export default {
  name: "ArticleDetail",
  data() {
    return {
      article: {},
      perms: {
        articleEdit: ["article:update"]
      }
    };
  },
  created() {},
  mounted() {
    const id = this.$route.query.articleId;
    this.getData(id);
  },
  computed: {},
  methods: {
    async getData(id) {
      const res = await GetArticleById(id);
      if (res.code == 200) {
        this.article = res.data;
      }
    },
    onEditClick(articleId) {
      this.$router.push({
        path: "/article/article_edit",
        query: { articleId: this.article.articleId, type: "edit" }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-detail {
  .box {
    margin: auto;
    width: 860px;
  }
  .grey-text {
    color: #999;
    font-size: 14px;
  }
}
</style>
