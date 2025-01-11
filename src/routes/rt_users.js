const express = require("express");
const multer = require("multer");
const usersRouter = express.Router();
const allowedRole = require("../middlewares/M_allowedRole");
const isLogin = require("../middlewares/isLogin");

const {
  register,
  getAllUser,
  getProfile,
  getUserbyId,
  editUser,
  editProfile,
  deleteUser,
} = require("../controllers/C_users");

const multerConfig = require("../config/multerConfig"); // Mengimport konfigurasi multer
const upload = multerConfig.upload;

usersRouter.get("/", getAllUser);
usersRouter.patch("/:id", editUser);
usersRouter.get("/:id", getUserbyId);
usersRouter.patch("/profile/:id", upload, editProfile);
usersRouter.get("/profile", isLogin(), allowedRole("user"), getProfile);
// usersRouter.patch("/profile", isLogin(), allowedRole("user"), editProfile);
usersRouter.post("/", register);
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
