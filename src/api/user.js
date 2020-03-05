import request from "@/utils/request";

const USER_PREFIX = "/user";
/**
 * 用户管理
 * @param {*} data
 */
export function GetUserList(params) {
  return request.get(USER_PREFIX + "/getUserList", params);
}
