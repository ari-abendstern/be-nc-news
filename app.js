const express = require("express");
const app = express();
app.use(express.json())


const {
  getTopics,
  getEndpoints,
  getArticles,
  getArticleById,
  getCommentsByArticleById,
  postCommentByArticleId,
  patchVotesByArticleId,
} = require("./controllers/index.controllers");
const {
  handleServerErrors,
  handleNonExistentPath,
  handleCustomErrors,
  handlePsql22P02,
  handlePsql23502,
  handlePsql23503,
} = require("./errors/index");

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.all("/api/*", handleNonExistentPath);
app.use(handleCustomErrors);

app.use(handlePsql22P02);

app.use(handlePsql23502);

app.use(handlePsql23503);

app.use(handleServerErrors);

module.exports = app;
