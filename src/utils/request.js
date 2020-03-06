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
  }

  // 单例
  static getInstance() {
    this._instance || (this._instance = new Request());
    return this._instance;
  }

  init() {
    // create an axios instance
    const service = axios.create({
      baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
      // withCredentials: true, // send cookies when cross-domain requests
      timeout: 5000 // request timeout
    });
    // request interceptor
    service.interceptors.request.use(
      config => {
        // do something before request is sent

        if (store.getters.token) {
          // let each request carry token
          // ['X-Token'] is a custom headers key
          // please modify it according to the actual situation
          config.headers["Authorization"] = getToken();
        }
        return config;
      },
      error => {
        // do something with request error
        console.log(error); // for debug
        return Promise.reject(error);
      }
    );

    // response interceptor
    service.interceptors.response.use(
      /**
       * If you want to get http information such as headers or status
       * Please return  response => response
       */

      /**
       * Determine the request status by custom code
       * Here is just an example
       * You can also judge the status by HTTP Status Code
       */
      response => {
        const res = response.data;
        // if the custom code is not 20000, it is judged as an error.
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
            return Promise.reject(new Error(res.msg || "权限出错"));
          } else {
            Message({
              message: "请求出错",
              type: "error",
              duration: 5 * 1000
            });
            return Promise.reject(new Error(res.msg || "请求出错"));
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
      return await this.service.post(url, qs.stringify(data), {
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
    // let signParams = parameterSign(parmas);
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
