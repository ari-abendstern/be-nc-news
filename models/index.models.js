const { selectTopics, selectEndpoints } = require("./topics.models");
const {
  selectArticles,
  selectArticleById,
  incrementVotes,
} = require("./articles.models");
const { selectCommentsByArticleId } = require("./comments.models");

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  incrementVotes,
};
