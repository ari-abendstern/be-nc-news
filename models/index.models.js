const { selectTopics, selectEndpoints } = require("./topics.models");
const {
  selectArticles,
  selectArticleById,
  incrementVotes,
} = require("./articles.models");
const {
  selectCommentsByArticleId,
  insertComment,
} = require("./comments.models");

const { selectUsers } = require("./users.models");

module.exports = {
  selectTopics,
  selectEndpoints,
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  incrementVotes,
  insertComment,

  selectUsers,
};
