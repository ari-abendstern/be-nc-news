const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id, limit, p) => {
  if (limit && Number.isNaN(+limit)) {
    return Promise.reject({ status: 400, msg: "invalid limit query" });
  }

  if (p && Number.isNaN(+p)) {
    return Promise.reject({ status: 400, msg: "invalid page query" });
  }
  if (!limit) limit = 10;
  if (p) {
    p = (p - 1) * limit;
  } else p = 0;

  return db
    .query(
      `SELECT * FROM comments
      WHERE article_id = $1 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${p}`,
      [article_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.insertComment = (body, username, article_id) => {
  return db
    .query(
      `INSERT INTO comments (
        body, 
        author, 
        article_id, 
        votes, 
        created_at
      ) 
      VALUES (
        $1, 
        $2, 
        $3, 
        0, 
        NOW()
      ) 
      RETURNING *;`,
      [body, username, article_id]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments 
      WHERE comment_id = $1 
      RETURNING *;`,
      [comment_id]
    )
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "not found",
        });
      }
      return comment;
    });
};

exports.incrementCommentVotes = (inc_votes, comment_id) => {
  return db
    .query(
      `UPDATE comments
      SET votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then((comment) => {
      return comment;
    });
};
