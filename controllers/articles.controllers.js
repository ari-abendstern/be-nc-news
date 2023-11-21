const { selectArticleById, selectArticles, selectCommentsByArticleId } = require("../models/index.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getCommentsByArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectCommentsByArticleId(article_id)
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch(next);
  };