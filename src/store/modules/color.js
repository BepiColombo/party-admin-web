import client from "webpack-theme-color-replacer/client";
import forElementUI from "webpack-theme-color-replacer/forElementUI";
import { setItem, getItem } from "@/utils/storage";

export default {
  namespaced: true,
  state: {
    // 颜色
    value: process.env.VUE_APP_ELEMENT_COLOR
  },
  actions: {
    /**
     * @description 设置颜色
     * @param {Object} context
     * @param {String} color 尺寸
     */
    set({ state, commit }, color) {
      return new Promise(async resolve => {
        // 记录上个值
        const old = state.value;
        // store 赋值
        state.value = color || process.env.VUE_APP_ELEMENT_COLOR;
        // 持久化
        setItem("THEME_COLOR", state.value);
        // 应用
        commit("apply", {
          oldColor: old,
          newColor: state.value
        });
        // end
        resolve();
      });
    },
    /**
     * @description 从持久化数据读取颜色设置
     * @param {Object} context
     */
    load({ state, commit }) {
      return new Promise(async resolve => {
        // 记录上个值
        const old = state.value;
        // store 赋值
        const color =
          getItem("THEME_COLOR") || process.env.VUE_APP_ELEMENT_COLOR;
        // 应用
        commit("apply", {
          oldColor: old,
          newColor: color
        });
        // end
        resolve();
      });
    }
  },
  mutations: {
    /**
     * @description 将 vuex 中的主题颜色设置应用到系统中
     * @param {Object} context
     * @param {Object} payload oldColor {String} 旧的颜色
     * @param {Object} payload newColor {String} 新颜色
     */
    apply(state, { oldColor, newColor }) {
      const options = {
        oldColors: [...forElementUI.getElementUISeries(oldColor)],
        newColors: [...forElementUI.getElementUISeries(newColor)]
      };
      // console.log(options);
      client.changer.changeColor(options);
    }
  }
};
