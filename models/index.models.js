const { selectTopics, selectEndpoints } = require("./topics.models");
const {
  selectArticles,
  selectArticleById,
  incrementArticleVotes,
} = require("./articles.models");
const {
  selectCommentsByArticleId,
  insertComment,
  removeCommentById,
  incrementCommentVotes,
} = require("./comments.models");
const { selectUsers, selectUserByUsername } = require("./users.models");

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  incrementArticleVotes,
  insertComment,
  removeCommentById,
  incrementCommentVotes,
  selectUsers,
  selectUserByUsername,
};
