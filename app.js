const express = require("express");
const app = express();
const { getTopics, getEndpoints } = require("./controllers/index.controllers");
const { handleServerErrors, handleNonExistentPath } = require("./errors/index");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.all("/api/*", handleNonExistentPath);

app.use(handleServerErrors);

module.exports = app;
