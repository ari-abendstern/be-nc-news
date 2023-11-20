exports.handleNonExistentPath = (req, res) => {
    res.status(404).send({ msg: "path does not exist" });
}

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
