const express = require("express");
const categoryRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/C_category");

categoryRouter.get("/", get);
categoryRouter.post("/", create);
categoryRouter.patch("/:id", edit);
categoryRouter.delete("/:id", drop);

module.exports = categoryRouter;
