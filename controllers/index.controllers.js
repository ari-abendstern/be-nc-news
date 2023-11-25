const { getTopics, postTopic } = require("./topics.controllers");
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
const { selectEndpoints } = require("../models/index.models");

const getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints: selectEndpoints() });
};

module.exports = {
  getTopics,
  postTopic,
  getArticles,
  getArticleById,
  deleteArticleById,
  getCommentsByArticleId,
  patchVotesByArticleId,
  postCommentByArticleId,
  postArticle,
  deleteCommentById,
  patchVotesByCommentId,
  getUsers,
  getUserByUsername,
  getEndpoints,
};
