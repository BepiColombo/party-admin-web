import request from "@/utils/request";

/**
 * 用户管理
 * @param {*} data
 */
export function GetUserList(params) {
  return request.get("/user_manage", params);
}
