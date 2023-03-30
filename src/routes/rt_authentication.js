const authRouter = require("express").Router();
const authController = require("../controllers/C_authentication");
const isLogin = require("../middlewares/isLogin");
const { body } = require("../middlewares/M_validate");

//login
authRouter.post("/", body("email", "password"), authController.login);
// logout
authRouter.delete("/", isLogin(), authController.logout);

module.exports = authRouter;
