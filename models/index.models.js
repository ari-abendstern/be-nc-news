const {
  selectTopics,
  insertTopic,
  selectEndpoints,
} = require("./topics.models");
const {
  selectArticles,
  selectArticleById,
  removeArticleById,
  incrementArticleVotes,
  insertArticle,
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
  insertTopic,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  removeArticleById,
  selectCommentsByArticleId,
  incrementArticleVotes,
  insertArticle,
  insertComment,
  removeCommentById,
  incrementCommentVotes,
  selectUsers,
  selectUserByUsername,
};
