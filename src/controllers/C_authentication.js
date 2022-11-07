const authRepo = require("../repo/R_authentication");
const { error, success } = require("../helpers/response");
module.exports = {
  login: (req, res) => {
    authRepo
      .login(req.body)
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
    authRepo
      .logout(req.userPayload)
      .then((response) => {
        success(res, 200, {
          data: response,
          msg: "Logout Success",
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        error(res, statusCode, { msg: objErr.err.message });
      });
  },
};

// =============================================

// const authRepo = require("../repo/R_authentication");

// module.exports = {
//   login: (req, res) => {
//     authRepo
//       .login(req.body)
//       .then((response) => {
//         res.status(200).json({
//           data: response,
//           msg: "Login Success",
//         });
//       })
//       .catch((objErr) => {
//         const statusCode = objErr.statusCode || 500;
//         res.status(statusCode).json({ msg: objErr.err.message });
//       });
//   },
//   logout: (req, res) => {
//     authRepo
//       .login(req.body)
//       .then((response) => {
//         res.status(200).json({
//           msg: "Log Out Success",
//         });
//       })
//       .catch((objErr) => {
//         const statusCode = objErr.statusCode || 500;
//         res.status(statusCode).json({ msg: objErr.err.message });
//       });
//   },
// };
