const { getTopics, getEndpoints } = require("./topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleById,
  patchVotesByArticleId,
} = require("./articles.controllers");

module.exports = {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleById,
  patchVotesByArticleId,
};
