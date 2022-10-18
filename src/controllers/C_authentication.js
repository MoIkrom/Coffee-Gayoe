const authRepo = require("../repo/R_authentication");

module.exports = {
  login: (req, res) => {
    authRepo
      .login(req.body)
      .then((response) => {
        res.status(200).json({
          data: response,
          msg: "Login Success",
        });
      })
      .catch((objErr) => {
        const statusCode = objErr.statusCode || 500;
        res.status(statusCode).json({ msg: objErr.err.message });
      });
  },
};

// =====================================================

// const bcrypt = require("bcrypt");
// const auth = {};
// const jwt = require("jsonwebtoken");

// const { successResponse, errorResponse } = require("../helpers/response");
// const { register, getPassByUserEmail } = require("../repo/R_authentication");

// auth.register = (req, res) => {
//   const {
//     body: { email, phone_number, password },
//   } = req;
//   bcrypt
//     .hash(password, 10)
//     .then((hashedPassword) => {
//       register(email, phone_number, hashedPassword)
//         .then(() => {
//           successResponse(res, 201, { msg: "Register Success" }, null);
//         })
//         .catch((error) => {
//           const { status, err } = error;
//           errorResponse(res, status, err);
//         });
//     })
//     .catch((err) => {
//       errorResponse(res, 500, err);
//     });
// };

// auth.logIn = async (req, res) => {
//   try {
//     const {
//       body: { email, password },
//     } = req;

//     const data = await getPassByUserEmail(email);
//     const result = await bcrypt.compare(password, data.password);
//     if (!result) return errorResponse(res, 400, { msg: "Email/Password Is Wrong" });

//     const payload = {
//       id: data.id,
//       email,
//     };
//     const jwtOpions = {
//       issuer: process.env.ISSUER,
//       expiresIn: "1000s",
//     };
//     const token = jwt.sign(payload, process.env.SECRET_KEY, jwtOpions);
//     successResponse(res, 200, { email, token }, null);
//   } catch (error) {
//     const { status, err } = error;
//     errorResponse(res, status, err);
//   }
// };

// module.exports = auth;
