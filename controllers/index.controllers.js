const { getTopics, getEndpoints } = require("./topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchVotesByArticleId,
  postCommentByArticleId,
} = require("./articles.controllers");
const { deleteCommentById } = require("./comments.controllers");

const {getUsers} = require('./users.controllers');

module.exports = {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  patchVotesByArticleId,
  postCommentByArticleId,
  deleteCommentById,
  getUsers
};
