const express = require("express");
const usersRouter = express.Router();
const { checkDuplicate } = require("../middlewares/M_authentication");
const { register, editPassword, createNewProfile, get } = require("../controllers/C_users");
const { checkToken } = require("../middlewares/isLogin");
const uploadImage = require("../middlewares/M_upload");
// const upload = uploadImage.single("image");
const allowedRole = require("../middlewares/M_allowedRole");

// //register
usersRouter.post("/", checkDuplicate, register);
// // Router.post("/new", , authController.register);

// Edit Password
usersRouter.patch("/account", editPassword);

usersRouter.get("/", checkToken, allowedRole("User"), get);
usersRouter.post("/profile", checkToken, createNewProfile);
// usersRouter.post("/profile", checkToken, upload, createNewProfile);
// edit Profile
usersRouter.patch("/profile/edit", checkToken, editPassword);
// usersRouter.delete("/:id", drop);
// usersRouter.patch("/edit/password", password);

module.exports = usersRouter;
