const { getTopics, getEndpoints } = require("./topics.controllers");
const {getArticles, getArticleById} = require('./articles.controllers');

module.exports = { getTopics, getEndpoints, getArticles, getArticleById};
