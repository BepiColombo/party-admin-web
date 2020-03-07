import request from "@/utils/request";

const ROLE_PREFIX = "/role";
/**
 * 角色管理
 * @param {*} data
 */
export function GetRoleList() {
  return request.get(ROLE_PREFIX + "/getRoleList");
}
