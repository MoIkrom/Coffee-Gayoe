const express = require("express");

//
const productRouter = express.Router();
const { get, create, edit, drop, sorting, food, coffee, nonCoffee } = require("../controllers/product");

productRouter.get("/", get);
productRouter.post("/", create);
productRouter.patch("/:id", edit);
productRouter.delete("/:id", drop);
productRouter.get("/sortingProduct", sorting);
productRouter.get("/filterFood", food);
productRouter.get("/filterCoffee", coffee);
productRouter.get("/filterNonCoffe", nonCoffee);

module.exports = productRouter;
