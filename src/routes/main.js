const express = require("express");

// import subrouter
const productRouter = require("./product");
const promoRouter = require("./promo");
const transactionRouter = require("./transaction");
const usersRouter = require("./users");

// variabel Main Router
const mainRouter = express.Router();
// variabel prefix
const prefix = "/api/v1";

// sambungkan subrouter dengan mainRouter
mainRouter.use(`${prefix}/products`, productRouter);
mainRouter.use(`${prefix}/promos`, promoRouter);
mainRouter.use(`${prefix}/transactions`, transactionRouter);
mainRouter.use(`${prefix}/users`, usersRouter);

module.exports = mainRouter;
