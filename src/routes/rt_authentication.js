const authRouter = require("express").Router();
const { login, logout } = require("../controllers/C_authentication");
const isLogin = require("../middlewares/isLogin");
const { body } = require("../middlewares/M_validate");

//login
authRouter.post("/", login);
// logout
authRouter.delete("/", isLogin(), logout);

module.exports = authRouter;
