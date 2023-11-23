const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  patchVotesByArticleId,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/index.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchVotesByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
