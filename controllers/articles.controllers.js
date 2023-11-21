const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  incrementVotes,
} = require("../models/index.models");

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
  Promise.all([
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ])
    .then(([comments, articles]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  Promise.all([incrementVotes(inc_votes, article_id), selectArticleById(article_id)])
    .then(([{rows: [article]}, redundantVariable]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
