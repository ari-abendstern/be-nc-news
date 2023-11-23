const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routes/api-router");
app.use("/api", apiRouter);

const {
  handleServerErrors,
  handleNonExistentPath,
  handleCustomErrors,
  handlePsql22P02,
  handlePsql23502,
  handlePsql23503,
} = require("./errors/index");

app.all("/api/*", handleNonExistentPath);

app.use(handleCustomErrors);

app.use(handlePsql22P02);

app.use(handlePsql23502);

app.use(handlePsql23503);

app.use(handleServerErrors);

module.exports = app;
