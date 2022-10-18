// import express kedalam variabel Main Router
const mainRouter = require("express").Router();

// import subrouter
const productRouter = require("./rt_product");
const promoRouter = require("./rt_promo");
// const transactionRouter = require("./rt_transaction");
const usersRouter = require("./rt_users");
const authRouter = require("./rt_authentication");
// const categoryRouter = require("./rt_category");

// variabel prefix
const prefix = "/api/v1";

// sambungkan subrouter dengan mainRouter
mainRouter.use(`${prefix}/products`, productRouter);
mainRouter.use(`${prefix}/promos`, promoRouter);
// mainRouter.use(`${prefix}/transactions`, transactionRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auth`, authRouter);
// mainRouter.use(`${prefix}/category`, categoryRouter);

// import middleware Upload
const uploadMiddleware = require("../middlewares/M_upload");
// const { json } = require("express");
mainRouter.post("/", uploadMiddleware.single("image"), (req, res) => {
  console.log(req.file);
  res.json({ file: req.file });
});

module.exports = mainRouter;
