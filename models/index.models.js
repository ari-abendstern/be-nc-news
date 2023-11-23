const { selectTopics, selectEndpoints } = require("./topics.models");
const {
  selectArticles,
  selectArticleById,
  incrementVotes,
} = require("./articles.models");
const {
  selectCommentsByArticleId,
  insertComment,
  removeCommentById,
} = require("./comments.models");
const { selectUsers, selectUserByUsername } = require("./users.models");

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  incrementVotes,
  insertComment,
  removeCommentById,
  selectUsers,
  selectUserByUsername,
};
