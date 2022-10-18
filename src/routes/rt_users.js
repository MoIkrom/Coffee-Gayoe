const express = require("express");
const usersRouter = express.Router();
const { checkDuplicateEmail } = require("../middlewares/M_authentication");
// const { checkDuplicateEmail, checkDuplicatePhoneNumber } = require("../middlewares/M_authentication");
const { register, editPassword, createNewProfile, get } = require("../controllers/C_users");
// const { checkToken } = require("../middlewares/isLogin");
const isLogin = require("../middlewares/isLogin");
const uploadImage = require("../middlewares/M_upload");
// const upload = uploadImage.single("image");
const allowedRole = require("../middlewares/M_allowedRole");

// //register
usersRouter.post("/", checkDuplicateEmail, register);
// usersRouter.post("/", checkDuplicateEmail, checkDuplicatePhoneNumber, register);
// // Router.post("/new", , authController.register);

// Edit Password
usersRouter.patch("/account", editPassword);

// usersRouter.get("/", checkToken, get);
// usersRouter.get("/", get);
usersRouter.get("/", isLogin(), allowedRole("Admin"), get);
// usersRouter.get("/", checkToken, allowedRole("Admin"), get);
usersRouter.post("/profile", createNewProfile);
// usersRouter.post("/profile", checkToken, upload, createNewProfile);
// edit Profile
// usersRouter.patch("/profile/edit", checkToken, editPassword);
// usersRouter.delete("/:id", drop);
// usersRouter.patch("/edit/password", password);

module.exports = usersRouter;
