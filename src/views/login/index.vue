<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n" />
      </ul>
    </div>
    <div class="page-login--layer page-login--layer-time">
      {{ time }}
    </div>
    <div class="page-login--layer">
      <div class="page-login--content">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">
            <!-- 时间是一切财富中最宝贵的财富 -->
          </p>
        </div>
        <div class="page-login--content-main">
          <!-- logo -->
          <div class="page-login-logo-container">
            <img class="page-login--logo" src="@/assets/logo.png" />
            <span>xxxx后台管理系统</span>
          </div>

          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                v-if="isLoginFormShow"
                class="loginForm"
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default"
              >
                <el-form-item prop="username">
                  <el-input
                    v-model="formLogin.username"
                    type="text"
                    placeholder="用户名"
                  >
                    <template slot="prepend"
                      ><i class="el-icon-user"
                    /></template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    v-model="formLogin.password"
                    type="password"
                    placeholder="密码"
                    @keyup.enter.native="submit"
                  >
                    <template slot="prepend"
                      ><i class="el-icon-lock"
                    /></template>
                  </el-input>
                </el-form-item>

                <el-button
                  size="default"
                  class="button-login"
                  type="primary"
                  @click="submit"
                  :loading="isLoading"
                >
                  登录
                </el-button>
              </el-form>

              <!-- 注册页面 -->
              <el-form
                v-else
                label-position="top"
                :rules="rules"
                :model="formRegists"
                ref="registsForm"
              >
                <el-form-item prop="username" label="用户名">
                  <el-input
                    v-model="formRegists.username"
                    type="text"
                    placeholder="用户名，长度应为2-10个字符"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                  <el-input
                    v-model="formRegists.password"
                    type="password"
                    placeholder="密码，长度应为6-10个字符"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="name" label="姓名">
                  <el-input
                    v-model="formRegists.name"
                    type="text"
                    placeholder="姓名"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别">
                  <el-radio v-model="formRegists.sex" :label="1">男</el-radio>
                  <el-radio v-model="formRegists.sex" :label="2">女</el-radio>
                </el-form-item>
                <el-form-item prop="birthday" label="出生日期">
                  <el-date-picker
                    v-model="formRegists.birthday"
                    type="date"
                    placeholder="选择出生年月"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="phone" label="手机号">
                  <el-input
                    v-model="formRegists.phone"
                    type="text"
                    placeholder="手机号"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item prop="address" label="地址">
                  <el-input
                    v-model="formRegists.address"
                    type="textarea"
                    placeholder="地址"
                  >
                  </el-input>
                </el-form-item>
                <el-button
                  size="default"
                  class="button-login"
                  type="primary"
                  @click="registsSubmit"
                  :loading="isLoading"
                >
                  注册
                </el-button>
              </el-form>
            </el-card>
            <a @click="toggleRegistLogin" class="toggle-text">{{
              isLoginFormShow ? "创建账号" : "已有账号?点击登录"
            }}</a>
          </div>
        </div>

        <div class="page-login--content-footer">
          <p class="page-login--content-footer-locales" />
          <p class="page-login--content-footer-copyright">
            Copyright
            <!-- <d2-icon name="copyright" /> -->
            2020 xxx组织出品
            <a href="https://github.com/FairyEver">
              @Jarvis Guo
            </a>
          </p>
          <p class="page-login--content-footer-options">
            <a href="#">帮助</a>
            <a href="#">隐私</a>
            <a href="#">条款</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { validPhone } from "@/utils/validate";
import { regists } from "@/api/auth";
export default {
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      if (!validPhone(value)) return callback(new Error("手机号格式不正确"));
      callback();
    };
    return {
      timeInterval: null,
      time: dayjs().format("HH:mm:ss"),
      captchaText: "发送验证码",
      isLoginFormShow: true,
      // 表单
      formLogin: {
        username: "admin",
        password: "123456"
      },
      formRegists: {},
      isLoading: false,
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        phone: [{ validator: checkPhone, trigger: "blur", required: true }],
        birthday: [
          {
            type: "date",
            required: true,
            message: "请选择出生日期",
            trigger: "change"
          }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.timeInterval = setInterval(() => {
      this.refreshTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  methods: {
    refreshTime() {
      this.time = dayjs().format("HH:mm:ss");
    },
    toggleRegistLogin() {
      try {
        if (this.isLoginFormShow) {
          this.$refs.loginForm.resetFields();
        } else {
          this.$refs.registsForm.resetFields();
        }
      } finally {
        this.isLoading = false;
        this.isLoginFormShow = !this.isLoginFormShow;
      }
    },
    // 提交登录信息
    submit() {
      this.isLoading = true;
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 登录
          // 注意 这里的演示没有传验证码
          // 具体需要传递的数据请自行修改代码
          try {
            const res = await this.$store.dispatch(
              "user/login",
              this.formLogin
            );
            const { menus } = await this.$store.dispatch(
              "user/getInfo",
              res.token
            );
            await this.$store.dispatch("permission/generateRoutes", menus);
            // dynamically add accessible routes
            this.$notify({
              title: "成功",
              message: "登录成功",
              type: "success"
            });
            this.$router.replace("/dashboard");
          } catch (e) {
          } finally {
            this.isLoading = false;
          }
        } else {
          // 登录表单校验失败
          this.$message.error("表单校验失败，请检查");
        }
      });
    },
    registsSubmit() {
      this.isLoading = true;
      this.$refs.registsForm.validate(async valid => {
        if (!valid) return;
        try {
          const res = await regists(this.formRegists);
          if (res.code === 200) {
            this.$notify({
              title: "成功",
              message: "注册成功",
              type: "success"
            });
            this.$store.commit("user/SET_TOKEN", res.data.token);
            await this.$store.dispatch(
              "permission/generateRoutes",
              res.data.menus
            );

            this.$router.replace("/dashboard");
          }
        } catch (e) {
        } finally {
          this.isLoading = false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #f0f2f5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .page-login-logo-container {
    width: 235px;
    height: 60px;
    display: flex;
    align-items: center;
    margin: 0 auto 20px auto;
    margin-bottom: 1em;
    .page-login--logo {
      width: 60px;
      height: 60px;
      // margin-bottom: 2em;
      // margin-top: -2em;
    }
    span {
      color: $color-text-normal;
      font-weight: bold;
      text-align: center;
      font-size: 20px;
      display: inline-block;
    }
  }

  // 登录表单
  .page-login--form {
    width: 400px;
    margin: auto;
    // 卡片
    .el-card {
      margin: 15px 0;
      padding: 30px 0;
      // height: 300px;
      .button-login {
        width: 100%;
      }
      .loginForm {
        width: 100%;
        // 输入框左边的图表区域缩窄
        .el-input-group__prepend {
          padding: 0px 14px;
        }
      }
    }
    .toggle-text {
      display: block;
      margin: auto;
      text-align: center;
      font-size: 0.9rem;
      color: $color-primary;
    }
  }

  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 0.5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #fff;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100% {
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
