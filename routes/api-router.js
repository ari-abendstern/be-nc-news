const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/index.controllers");
const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.route("/").get(getEndpoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
