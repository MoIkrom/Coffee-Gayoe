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

usersRouter.get("/", getAllUser);
usersRouter.patch("/:id", editUser);
usersRouter.get("/:id", getUserbyId);
usersRouter.get("/:id", editProfile);
usersRouter.get("/profile", isLogin(), allowedRole("user"), getProfile);
usersRouter.put("/profile", isLogin(), allowedRole("user"), editProfile);
usersRouter.post("/", register);
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
