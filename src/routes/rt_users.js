const express = require("express");

const usersRouter = express.Router();
const allowedRole = require("../middlewares/M_allowedRole");
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/M_validate");
const { diskUpload } = require("../middlewares/M_upload");
const { get, create, edit, drop, editPassword } = require("../controllers/C_users");
// const checkDuplicate = require("../middlewares/M_checkDuplicate");

usersRouter.get("/", get);
usersRouter.get("/profile", get);
usersRouter.post("/", validate.body("email", "password", "phone_number"), create);
usersRouter.patch("/editpassword", isLogin(), allowedRole("user", "admin"), editPassword);
usersRouter.patch("/", isLogin(), allowedRole("user"), diskUpload.single("image"), edit);
usersRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

module.exports = usersRouter;

// =========================================================

// const express = require("express");
// const usersRouter = express.Router();
// // const checkDuplicate = require("../middlewares/M_authentication");
// const { checkDuplicateEmail, checkDuplicatePhoneNumber } = require("../middlewares/M_authentication");
// const { register, editPassword, createNewProfile, get, getById } = require("../controllers/C_users");
// // const { checkToken } = require("../middlewares/isLogin");
// const isLogin = require("../middlewares/isLogin");
// const uploadImage = require("../middlewares/M_upload");
// // const upload = uploadImage.single("image");
// const allowedRole = require("../middlewares/M_allowedRole");

// // //register
// // usersRouter.post("/", checkDuplicate, register);
// usersRouter.post("/", checkDuplicateEmail, checkDuplicatePhoneNumber, register);
// // // Router.post("/new", , authController.register);

// // Edit Password
// usersRouter.patch("/account", editPassword);

// // usersRouter.get("/", checkToken, get);
// // usersRouter.get("/", get);
// usersRouter.get("/", isLogin(), allowedRole("Admin"), get);
// usersRouter.get("/", isLogin(), allowedRole("user"), getById);
// // usersRouter.get("/", checkToken, allowedRole("Admin"), get);
// usersRouter.post("/profile", createNewProfile);
// // usersRouter.post("/profile", checkToken, upload, createNewProfile);
// // edit Profile
// // usersRouter.patch("/profile/edit", checkToken, editPassword);
// // usersRouter.delete("/:id", drop);
// // usersRouter.patch("/edit/password", password);

// module.exports = usersRouter;
