const { selectTopics, selectEndpoints } = require("./topics.models");
const { selectArticles, selectArticleById } = require("./articles.models");
const {
  selectCommentsByArticleId,
  insertComment,
} = require("./comments.models");

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertComment,
};
