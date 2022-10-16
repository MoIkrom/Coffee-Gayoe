const express = require("express");
const usersRouter = express.Router();
const { checkDuplicate } = require("../middlewares/M_validate");
// const { registered } = require("../controllers/C_users");

const { get, create, edit, drop, password } = require("../controllers/C_users");

//register
// Router.post("/new", checkDuplicate, authController.register);
usersRouter.get("/", get);
usersRouter.post("/", checkDuplicate, create);
usersRouter.patch("/:id", edit);
usersRouter.delete("/:id", drop);
usersRouter.patch("/edit/password", password);

module.exports = usersRouter;

// // Profile
// usersRouter.get("/", get);
// usersRouter.post("/", create);
// usersRouter.patch("/:id/profile", edit);
// usersRouter.delete("/:id", drop);

// // Register
// usersRouter.get("/account", registered);
// usersRouter.post("/account", registered);
// usersRouter.patch("/:id/account", editAcc);
// usersRouter.delete("/:id/account", dropAcc);

// edit password
// usersRouter.patch("/:id/account/Pass", editAcc);
