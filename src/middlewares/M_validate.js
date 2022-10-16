const jwt = require("jsonwebtoken");
// const { register } = require("../repo/R_users");
// const { errorResponse } = require("../helpers/response");
const { check_email } = require("../repo/R_users");

const checkDuplicate = (req, res, next) => {
  check_email(req.body.email)
    .then((result) => {
      if (result.rowCount > 2) return;
      res.status(400).json({ msg: "Email is Already Used" });
      next();
    })
    .catch((error) => {
      res.status(500).json({ msg: "Internal Server Error" });
    });
};
module.exports = { checkDuplicate };
// module.exports = { checkDuplicate, checkToken };
