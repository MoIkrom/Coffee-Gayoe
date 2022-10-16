const express = require("express");
const authRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/C_authentication");

authRouter.get("/", get);
authRouter.post("/", create);
authRouter.patch("/:id", edit);
authRouter.delete("/:id", drop);

module.exports = authRouter;
