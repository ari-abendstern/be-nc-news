const { getTopics, getEndpoints } = require("./topics.controllers");
const { getArticleById } = require("./articles.controllers");

module.exports = { getTopics, getArticleById, getEndpoints};
