const authRouter = require("express").Router();
const authController = require("../controllers/C_authentication");
const isLogin = require("../middlewares/isLogin");

//login
authRouter.post("/", authController.login);
// logout
authRouter.delete("/", isLogin(), authController.logout);

module.exports = authRouter;

// =================================================================

// const authRouter = require("express").Router();

// const { login } = require("../controllers/C_authentication");

// // login
// authRouter.post("/", login);
// // // logout
// // authRouter.delete("/", logout);
// authRouter.delete("/", (req, res) => {
//   res.json({
//     msg: " Logout Success",
//   });
// });

// module.exports = authRouter;
