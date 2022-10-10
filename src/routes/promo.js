const express = require("express");

const promoRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/promo");

promoRouter.get("/", get);
promoRouter.post("/", create);
promoRouter.patch("/:id", edit);
promoRouter.delete("/:id", drop);

module.exports = promoRouter;
