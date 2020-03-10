import Vue from "vue";

import Cookies from "js-cookie";

import "animate.css";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
//需要定制warning、success等element sass变量时，不引入lib下的主题样式
// import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log

// 权限指令
import permission from "./directive/permission";

import * as filters from "./filters"; // global filters
import format from "./mixins/format";

Vue.mixin(format);

Vue.use(permission);
Vue.use(Element, {
  size: Cookies.get("size") || "small" // set element-ui default size
});

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  mounted() {
    //加载主题色
    this.$store.dispatch("color/load");
  }
});
