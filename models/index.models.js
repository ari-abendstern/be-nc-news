const { selectTopics, selectEndpoints } = require("./topics.models");
const {
  selectArticles,
  selectArticleById,
  incrementVotes,
} = require("./articles.models");
const {
  selectCommentsByArticleId,
  insertComment,
  removeCommentById
} = require("./comments.models");

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  incrementVotes,
  insertComment,
  removeCommentById
};
