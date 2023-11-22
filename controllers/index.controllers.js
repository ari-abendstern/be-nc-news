const { getTopics, getEndpoints } = require("./topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleById,
  patchVotesByArticleId,
  postCommentByArticleId,
} = require("./articles.controllers");

module.exports = {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleById,
  patchVotesByArticleId,
  postCommentByArticleId,
};
