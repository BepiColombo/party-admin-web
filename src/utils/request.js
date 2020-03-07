import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";
import { getToken } from "@/utils/storage";
import { ResponseCode } from "@/constants";
import qs from "qs";
class Request {
  constructor() {
    this._instance = null;
    this.service = this.init();
    this.CodeResponse = Object.keys(ResponseCode).reduce((p, v) => {
      p[ResponseCode[v]] = v;
      return p;
    }, {});
  }

  // 单例
  static getInstance() {
    this._instance || (this._instance = new Request());
    return this._instance;
  }

  init() {
    const service = axios.create({
      baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
      // withCredentials: true, // send cookies when cross-domain requests
      timeout: 5000, // request timeout
      headers: {
        "Content-type": "application/json"
      }
    });
    service.interceptors.request.use(
      config => {
        if (store.getters.token) {
          config.headers["Authorization"] = getToken();
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // response interceptor
    service.interceptors.response.use(
      response => {
        const res = response.data;
        if (res.code !== ResponseCode.SUCCESS) {
          if (
            res.code === ResponseCode.UNAUTHORIZED ||
            res.code === ResponseCode.TOKEN_EXPIRED ||
            res.code === ResponseCode.TOKEN_INVALID ||
            res.code === ResponseCode.AUTH_ERR
          ) {
            router.push("/login");
            Message({
              message: "登录信息出错，请重新登录",
              type: "warning",
              duration: 5 * 1000
            });
            return Promise.reject(new Error(res.msg || "error"));
          } else {
            let message = "请求出错";
            if (this.CodeResponse[res.code]) {
              message = res.msg;
            }
            Message({
              message: message,
              type: "error",
              duration: 5 * 1000
            });
            return res;
          }
        } else {
          return res;
        }
      },
      error => {
        console.log("err" + error); // for debug
        Message({
          message: error.message,
          type: "error",
          duration: 5 * 1000
        });
        return Promise.reject(error);
      }
    );

    return service;
  }

  async post(url, data, config) {
    try {
      return await this.service.post(url, data, {
        headers: {
          ...config
        }
      });
    } catch (error) {}
  }

  async delete(url, params, config) {
    try {
      return await this.service.delete(url, {
        params,
        headers: {
          ...config
        }
      });
    } catch (e) {}
  }

  async put(url, data, config) {
    try {
      return await this.service.put(url, data, {
        headers: {
          ...config
        }
      });
    } catch (e) {}
  }

  async get(url, params, config) {
    try {
      return await this.service.get(url, {
        params,
        headers: {
          ...config
        }
      });
    } catch (error) {}
  }
}

export default Request.getInstance();
