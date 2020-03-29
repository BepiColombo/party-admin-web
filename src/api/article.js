import request from "@/utils/request";

const ARTICLE_PREFIX = "/article";
/**
 * 文章管理
 */
export function GetArticleList(queryBody) {
  return request.post(ARTICLE_PREFIX + "/findArticles", queryBody);
}

/**
 * 通过Id查询文章
 * @param {*} articleId
 */
export function GetArticleById(articleId) {
  return request.get(ARTICLE_PREFIX + "/findArticleById", { articleId });
}

/**
 * 更新文章
 */
export function UpdateArticle(article) {
  return request.post(ARTICLE_PREFIX + "/updateArticle", article);
}

/**
 * 删除文章
 */
export function DeleteArticle(articleId) {
  return request.post(ARTICLE_PREFIX + "/deleteArticle", articleId);
}

/**
 * 新增文章
 */
export function AddArticle(article) {
  return request.post(ARTICLE_PREFIX + "/addArticle", article);
}
