const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/index.controllers");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter