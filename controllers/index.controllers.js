const { getTopics, getEndpoints } = require("./topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchVotesByArticleId,
  postCommentByArticleId,
  postArticle,
} = require("./articles.controllers");
const {
  deleteCommentById,
  patchVotesByCommentId,
} = require("./comments.controllers");
const { getUsers, getUserByUsername } = require("./users.controllers");

module.exports = {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postArticle,
  patchVotesByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  getUsers,
  getUserByUsername,
  patchVotesByCommentId,
};
