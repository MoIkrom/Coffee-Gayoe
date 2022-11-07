// const { errorResponse } = require("../helpers/response");
// const { getUserByEmail, getUserByPhoneNumber } = require("../repo/R_authentication");
const { createUsers } = require("../repo/R_users");

//

const checkDuplicateEmail = (req, res, next) => {
  createUsers(req.body.email)
    .then((result) => {
      if (result.rowCount > 0) return error(res, 400, { msg: "Email is Already Used" });
      next();
    })
    .catch((error) => {
      const { status, err } = error;
      errorResponse(res, status, err);
    });
};

const checkDuplicatePhoneNumber = (req, res, next) => {
  createUsers(req.body.phone_number)
    .then((result) => {
      if (result.rowCount > 0) return error(res, 400, { msg: "Phone Number is already Used" });
      next();
    })
    .catch((error) => {
      const { status, err } = error;
      errorResponse(res, status, err);
    });
  next();
};

const checkDuplicate = { checkDuplicatePhoneNumber, checkDuplicateEmail };

module.exports = checkDuplicate;
