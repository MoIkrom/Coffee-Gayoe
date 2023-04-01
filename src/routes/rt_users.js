const express = require("express");
const multer = require("multer");
const usersRouter = express.Router();
const allowedRole = require("../middlewares/M_allowedRole");
const isLogin = require("../middlewares/isLogin");
const validate = require("../middlewares/M_validate");
const { memoryUpload, errorHandler } = require("../middlewares/M_upload");
const cloudinary = require("../middlewares/M_cloudinary_profile");
const { get, create, edit, drop, editPassword, getProfile, profile, verify } = require("../controllers/C_users");
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

// Punya Acil
function uploadFiles(req, res, next) {
  memoryUpload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json({ msg: err.message });
    } else if (err) {
      return res.json({ msg: err.message });
    }
    next();
  });
}
// ========================

usersRouter.get("/", isLogin(), allowedRole("admin"), get);
usersRouter.get("/profile", isLogin(), allowedRole("user"), getProfile);

// ======================
// Punya Acil
usersRouter.patch("/profile", isLogin(), allowedRole("user"), uploadFiles, cloudinary, profile);
usersRouter.post("/", validate.body("email", "password", "username"), create);
usersRouter.post("/verify/:id", verify);
usersRouter.patch("/editpassword", isLogin(), allowedRole("user", "admin"), editPassword);
usersRouter.patch("/", isLogin(), allowedRole("user"), uploadFile, cloudinary, edit);
usersRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

module.exports = usersRouter;
