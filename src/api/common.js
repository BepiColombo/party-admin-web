import request from "@/utils/request";
/**
 * 上传文件
 */
export function Upload(formData) {
  return request.post("/user/upload", formData);
}
