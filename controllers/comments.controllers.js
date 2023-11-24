const { checkExists } = require("../db/seeds/utils");
const {
  removeCommentById,
  incrementCommentVotes,
} = require("../models/index.models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchVotesByCommentId = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { comment_id },
  } = req;
  Promise.all([
    incrementCommentVotes(inc_votes, comment_id),
    checkExists("comments", "comment_id", comment_id),
  ])
    .then(
      ([
        {
          rows: [comment],
        },
      ]) => {
        res.status(200).send({ comment });
      }
    )
    .catch(next);
};
