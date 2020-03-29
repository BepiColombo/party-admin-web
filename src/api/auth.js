import request from "@/utils/request";

/**
 * 登录
 */
export function login(param) {
  return request.post("/login", param);
}

/**
 * 获取用户信息
 */
export function getInfo(token) {
  return request.post("/getUserInfo", { token });
}

/**
 * 更新用户资料
 * @param {*} user
 */
export function updateProfile(user) {
  return request.post("/updateProfile", user);
}

/**
 * 注册
 */
export function regists(user) {
  return request.post("/regist", user);
}

/**
 * 登出
 */
export function lotgout() {
  return request.get("/sms_login");
}
