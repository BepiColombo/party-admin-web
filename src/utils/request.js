import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
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
        if (response.status === 401) {
          Message({
            message: "没有权限",
            type: "error",
            duration: 5 * 1000
          });
        } else {
          // if the custom code is not 20000, it is judged as an error.
          if (res.code !== ResponseCode.SUCCESS) {
            let msg = res.msg;
            // if (res.code === ResponseCode.TOKEN_EXPIRED ) {
            //   // to re-login
            //  msg = "登录已失效"
            // }else if(res.code === ResponseCode.TOKEN_INVALID){
            //   msg = "token验证失败"
            // }else if(ResponseCode.AUTH_ERR) {
            //   msg = "token为空"
            // }
            Message({
              message: msg || "Error",
              type: "error",
              duration: 5 * 1000
            });

            return Promise.reject(new Error(res.message || "Error"));
          } else {
            return res;
          }
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
