import request from "@/utils/request";

const ROLE_PREFIX = "/role";
const MENU_PREFIX = "/menu";
/**
 * 角色管理
 */
export function GetRoleList() {
  return request.get(ROLE_PREFIX + "/getRoleList");
}

/**
 * 删除角色
 * @param {*} roleId
 */
export function DeleteRoleById(roleId) {
  return request.post(ROLE_PREFIX + "/deleteRole", { roleId });
}

/**
 * 更新角色
 * @param {*} role
 */
export function UpdateRole(role) {
  return request.post(ROLE_PREFIX + "/updateRole", role);
}

/**
 * 新增角色
 * @param {*} role
 */
export function AddRole(role) {
  return request.post(ROLE_PREFIX + "/addRole", role);
}

/**
 * 菜单管理
 */
export function GetMenuList() {
  return request.get(MENU_PREFIX + "/getMenuList");
}

/**
 * 删除菜单
 * @param {*} menuId
 */
export function DeleteMenuById(menuId) {
  return request.post(MENU_PREFIX + "/deleteMenu", { menuId });
}

/**
 * 更新菜单
 * @param {*} menu
 */
export function UpdateMenu(menu) {
  return request.post(MENU_PREFIX + "/updateMenu", menu);
}

/**
 * 新增菜单
 * @param {*} menu
 */
export function AddMenu(menu) {
  return request.post(MENU_PREFIX + "/addMenu", menu);
}

/**
 * 更新角色-菜单
 * @param {*} ids
 */
export function UpdateRoleMenus(ids) {
  return request.post(ROLE_PREFIX + "/batchRoleMenuAction", ids);
}

/**
 * 获取某一角色的菜单
 * @param {*} roleId
 */
export function GetMenusOfRole(roleId) {
  return request.get(ROLE_PREFIX + "/getMenusOfRole", roleId);
}
