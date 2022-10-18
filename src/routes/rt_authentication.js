const authRouter = require("express").Router();

const authController = require("../controllers/C_authentication");

// login
authRouter.post("/", authController.login);
// logout
authRouter.delete("/", (req, res) => {
  res.json({
    msg: "Berhasil Logout",
  });
});

module.exports = authRouter;

// ===================================

// //logOut
// Router.delete("/", (_, res) => {
//   res.json({
//     msg: "Berhasil Logout",
//   });
// });
