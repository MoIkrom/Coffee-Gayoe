const express = require("express");
const multer = require("multer");
const usersRouter = express.Router();
const allowedRole = require("../middlewares/M_allowedRole");
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/M_validate");
// const { diskUpload } = require("../middlewares/M_upload");
const { memoryUpload, errorHandler } = require("../middlewares/M_upload");
const cloudinary = require("../middlewares/M_cloudinary_profile");
const { get, create, edit, drop, editPassword, getProfile } = require("../controllers/C_users");
// const checkDuplicate = require("../middlewares/M_checkDuplicate");

function uploadFile(req, res, next) {
  const upload = memoryUpload.single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      res.json("Size image maximal 4mb");
    } else if (err) {
      // Error File format
      res.json("Format image Wrong!");
    }
    // Everything went fine.
    next();
  });
}

usersRouter.get("/", isLogin(), allowedRole("admin"), get);
usersRouter.get("/profile", isLogin(), getProfile);
usersRouter.post("/", validate.body("email", "password", "phone_number"), create);
usersRouter.patch("/editpassword", isLogin(), allowedRole("user", "admin"), editPassword);
usersRouter.patch("/", isLogin(), allowedRole("user"), uploadFile, cloudinary, edit);
// usersRouter.patch("/", isLogin(), allowedRole("user"), diskUpload.single("image"), edit);
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
