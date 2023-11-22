const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
      [article_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.insertComment = (body, username, article_id) => {
  return db
    .query(
      "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *;",
      [body, username, article_id]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.removeCommentById = (comment_id) => {
    return db
      .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id])
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