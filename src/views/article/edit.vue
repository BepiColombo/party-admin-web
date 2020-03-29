<template>
  <div class="article-edit">
    <el-card class="card-container">
      <div slot="header" class="clearfix">
        <span>{{ type == "edit" ? "编辑文章" : "添加文章" }}</span>
      </div>
      <el-form
        :model="articleForm"
        label-position="top"
        :rules="rules"
        ref="articleRef"
      >
        <el-form-item class="thumbnail">
          <ele-upload-image
            :action="env.VUE_APP_BASE_API + '/user/upload'"
            :responseFn="handleResponse"
            :headers="headers"
            v-model="articleForm.articleThumbnail"
          ></ele-upload-image>
          <h3>封面</h3>
        </el-form-item>
        <el-form-item label="文章标题" prop="articleTitle">
          <el-input v-model="articleForm.articleTitle"></el-input>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input
            type="textarea"
            v-model="articleForm.articleOutline"
          ></el-input>
        </el-form-item>

        <el-form-item label="文章内容">
          <div ref="editor" class="text" />
        </el-form-item>

        <el-form-item class="submit">
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import EleUploadImage from "vue-ele-upload-image";
import E from "wangeditor";
import { getToken } from "@/utils/storage";
import { Upload } from "@/api/common";
import {
  GetArticleList,
  GetArticleById,
  UpdateArticle,
  AddArticle
} from "@/api/article";
export default {
  name: "ArticleEdit",
  data() {
    return {
      articleForm: {
        articleThumbnail: "",
        articleTitle: ""
      },
      rules: {
        articleTitle: [
          { required: true, message: "请输入文章标题", trigger: "blur" }
        ]
      },
      type: "add",
      headers: {
        Authorization: getToken()
      },
      env: process.env
    };
  },
  created() {},
  async mounted() {
    const { articleId, type } = this.$route.query;
    if (type == "edit") {
      const res = await GetArticleById(articleId);
      if (res.code == 200) {
        this.articleForm = res.data;
      }
    }
    this.type = type;
    this.editorInit();
  },
  components: { EleUploadImage },
  computed: {},
  methods: {
    async editorInit() {
      let editor = new E(this.$refs.editor);
      // 自定义菜单配置
      editor.customConfig.zIndex = 10;
      // 文件上传
      editor.customConfig.customUploadImg = (files, insert) => {
        files.forEach(image => {
          let formData = new FormData();
          formData.append("file", image);
          Upload(formData).then(res => {
            insert(res.data);
          });
        });
      };
      editor.customConfig.onchange = html => {
        this.articleForm.articleContent = html;
      };
      editor.create();
      // 初始化数据
      editor.txt.html(this.articleForm.articleContent);
    },
    handleResponse(response, file, fileList) {
      this.articleForm.articleThumbnail = response.data;
      return response.data;
    },
    submit() {
      this.$refs.articleRef.validate(async valid => {
        if (valid) {
          let res;
          if (this.type == "add") {
            res = await AddArticle(this.articleForm);
            if (res.code == "200") {
              this.$message.success("添加成功");
            }
          } else {
            res = await UpdateArticle(this.articleForm);
            if (res.code == "200") {
              this.$message.success("编辑成功");
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.article-edit {
  .card-container {
    width: 840px;
    margin: auto;
    .el-form {
      margin: auto;
      width: 720px;
      .submit,
      .thumbnail {
        display: flex;
        justify-content: center;
        h3 {
          text-align: center;
        }
      }
    }
  }
}
</style>
