import request from "@/utils/request";

const ORG_PREFIX = "/org";
/**
 * 组织管理
 */
export function GetOrgList(queryBody) {
  return request.get(ORG_PREFIX + "/getOrgList", queryBody);
}

/**
 * 更新组织
 */
export function UpdateOrg(org) {
  return request.post(ORG_PREFIX + "/updateOrg", org);
}

/**
 * 删除组织
 */
export function DeleteOrg(orgId) {
  return request.post(ORG_PREFIX + "/deleteOrg", orgId);
}

/**
 * 新增组织
 */
export function AddOrg(org) {
  return request.post(ORG_PREFIX + "/insertOrg", org);
}
