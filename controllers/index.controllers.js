const { getTopics, postTopic, getEndpoints } = require("./topics.controllers");
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
  postTopic,
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
