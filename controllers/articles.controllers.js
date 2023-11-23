const { checkExists } = require("../db/seeds/utils");
const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  incrementVotes,
  insertComment,
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
  const { topic, sort_by, order } = req.query;


  const articlePromises = [selectArticles(topic, sort_by, order)];

  if (topic) articlePromises.push(checkExists("topics", "slug", topic));

  Promise.all(articlePromises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    selectCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchVotesByArticleId = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { article_id },
  } = req;
  Promise.all([
    incrementVotes(inc_votes, article_id),
    checkExists("articles", "article_id", article_id),
  ])
    .then(
      ([
        {
          rows: [article],
        },
      ]) => {
        res.status(200).send({ article });
      }
    )
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const {
    body: { username, body },
    params: { article_id },
  } = req;
  insertComment(body, username, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
