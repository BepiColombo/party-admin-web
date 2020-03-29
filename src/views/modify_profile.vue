<template>
  <div class="modify_profile">
    <el-card class="card-box">
      <div slot="header">
        <span>修改资料</span>
      </div>
      <el-form :model="form">
        <el-form-item class="avatar">
          <ele-upload-image
            :action="env.VUE_APP_BASE_API + '/user/upload'"
            :responseFn="handleResponse"
            :headers="headers"
            v-model="form.avatar"
          ></ele-upload-image>
        </el-form-item>
        <el-form-item prop="username" label="用户名">
          <el-input v-model="form.username" type="text" disabled> </el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称">
          <el-input v-model="form.nickname" type="text" placeholder="昵称">
          </el-input>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-radio v-model="form.sex" :label="1">男</el-radio>
          <el-radio v-model="form.sex" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item prop="birthday" label="出生日期">
          <el-date-picker
            v-model="form.birthday"
            type="date"
            placeholder="选择出生年月"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="form.address" type="textarea" placeholder="地址">
          </el-input>
        </el-form-item>

        <el-form-item class="submit">
          <el-button type="primary" @click="submit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import EleUploadImage from "vue-ele-upload-image";
import { getToken } from "@/utils/storage";
import { Upload } from "@/api/common";
import { updateProfile } from "@/api/auth";
export default {
  name: "modifyProfile",
  components: { EleUploadImage },
  data() {
    return {
      form: {},
      headers: {
        Authorization: getToken()
      },
      env: process.env
    };
  },
  mounted() {
    this.form = this.userInfo;
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    async submit() {
      const res = await updateProfile(this.form);
      if (res.code == 200) {
        this.$message.success("更新成功");
      }
    },
    handleResponse(response, file, fileList) {
      if (response.code == 200) {
        this.form.avatar = response.data;
      }
      return response.data;
    }
  }
};
</script>
<style lang="scss" scope>
.modify_profile {
  .card-box {
    margin: 80px auto;
    width: 560px;
  }
  .avatar {
    display: flex;
    justify-content: center;
  }
  .submit {
    display: flex;
    justify-content: center;
  }
}
</style>
