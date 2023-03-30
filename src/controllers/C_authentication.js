const { login, logout } = require("../repo/R_authentication");
const { error, success } = require("../helpers/response");
module.exports = {
  login: (req, res) => {
    login(req.body)
      .then((response) => {
        success(res, 200, {
          data: response,
          msg: "Login Success",
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        error(res, statusCode, { msg: objErr.err.message });
      });
  },

  logout: (req, res) => {
    logout(req.userPayload)
      .then((response) => {
        success(res, 200, {
          msg: "Logout Success",
          data: response,
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        error(res, statusCode, { msg: objErr.err.message });
      });
  },
};
