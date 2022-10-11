const express = require("express");
const productRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/product");

productRouter.get("/", get);
productRouter.post("/", create);
productRouter.patch("/:id", edit);
productRouter.delete("/:id", drop);

module.exports = productRouter;
