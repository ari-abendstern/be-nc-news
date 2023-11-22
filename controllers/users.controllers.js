const {selectUsers} = require('../models/index.models');

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
      res.status(200).send({ users });
    });
  };