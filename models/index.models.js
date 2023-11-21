const { selectTopics, selectEndpoints } = require("./topics.models");
const {selectArticles, selectArticleById} = require('./articles.models');

module.exports = { selectTopics, selectEndpoints, selectArticles, selectArticleById };