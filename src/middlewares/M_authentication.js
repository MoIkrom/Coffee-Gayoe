const { errorResponse } = require("../helpers/response");
const { getUserByEmail, getUserByPhoneNumber } = require("../repo/R_authentication");

module.exports = {
  checkDuplicateEmail: (req, res, next) => {
    getUserByEmail(req.body.email)
      .then((result) => {
        if (result.rowCount > 0) return errorResponse(res, 400, { msg: "Email is Already Used" });
        next();
      })
      .catch((error) => {
        const { status, err } = error;
        errorResponse(res, status, err);
      });
  },

  // checkDuplicatePhoneNumber: (req, res, next) => {
  //   getUserByPhoneNumber(req.body.phone_number)
  //     .then((result) => {
  //       if (result.rowCount > 0) return errorResponse(res, 400, { msg: "Email is Already Used" });
  //       next();
  //     })
  //     .catch((error) => {
  //       const { status, err } = error;
  //       errorResponse(res, status, err);
  //     });
  //   next();
  // },
};
