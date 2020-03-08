import request from "@/utils/request";

const USER_PREFIX = "/user";
/**
 * 用户管理
 * @param {*} data
 */
export function GetUserList(params) {
  return request.post(USER_PREFIX + "/getUserList", params);
}

/**
 * 更新用户
 * @param {*} user
 */
export function UpdateUserByManager(user) {
  return request.post(USER_PREFIX + "/updateUserByManager", user);
}

/**
 * 删除用户
 * @param {*} userId
 */
export function DeleteUser(userId) {
  return request.post(USER_PREFIX + "/deleteUser", { userId });
}
