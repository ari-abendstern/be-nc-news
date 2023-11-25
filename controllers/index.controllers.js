const { getTopics, postTopic, getEndpoints } = require("./topics.controllers");
const {
  getArticles,
  getArticleById,
  deleteArticleById,
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
  postTopic,
  getEndpoints,
  getArticles,
  getArticleById,
  deleteArticleById,
  getCommentsByArticleId,
  postArticle,
  patchVotesByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  getUsers,
  getUserByUsername,
  patchVotesByCommentId,
};
