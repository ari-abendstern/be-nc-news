const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.body,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "not found",
        });
      }

      article.comment_count = +article.comment_count;
      return article;
    });
};

exports.selectArticles = (topic, sort_by, order, limit, p) => {
  if (
    sort_by &&
    ![
      "article_id",
      "author",
      "title",
      "topic",
      "created_at",
      "votes",
      "comment_count",
      "article_img_url",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  if (order && !["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  if (limit && Number.isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: "invalid limit query" });
  }

  if (p && Number.isNaN(+p)) {
    return Promise.reject({ status: 400, msg: "invalid page query" });
  }

  const queryValues = [];
  let topicString = "";

  if (topic) {
    queryValues.push(topic);
    topicString = "WHERE topic = $1";
  }

  if (!limit) limit = 10;
  if (p) {
    p = (p - 1) * limit;
  } else p = 0;

  return db
    .query(
      `SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT OUTER JOIN comments ON articles.article_id = comments.article_id
      ${topicString}
      GROUP BY articles.article_id
      ORDER BY ${sort_by || "created_at"} ${order || "DESC"}
      LIMIT ${limit} OFFSET ${p}`,
      queryValues
    )
    .then((result) => {
      return result.rows.map((article) => {
        article.comment_count = +article.comment_count;
        return article;
      });
    });
};

exports.incrementArticleVotes = (inc_votes, article_id) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((article) => {
      return article;
    });
};

exports.insertArticle = (author, title, topic, body, article_img_url) => {
  if (!article_img_url)
    article_img_url =
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";

  return db
    .query(
      "INSERT INTO articles (author, title, topic, body, article_img_url, created_at, votes) VALUES ($1, $2, $3, $4, $5, NOW(), 0) RETURNING *;",
      [author, title, topic, body, article_img_url]
    )
    .then(({ rows: [article] }) => {
      return article;
    });
};
