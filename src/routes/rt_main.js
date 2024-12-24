const express = require("express");

const mainRouter = express.Router();

//menghubungkan router ke product
const productRouter = require("./rt_product");
const authRouter = require("./rt_authentication");
const transactionRouter = require("./rt_transaction");
const usersRouter = require("./rt_users");
const prefix = "/api/v1";

//menayambungkan main router ke sub router
mainRouter.use(`${prefix}/product`, productRouter);
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/transactions`, transactionRouter);
mainRouter.get("/", (req, res) => { 
  res.send("Welcome to Coffe Gayoe API");  
});

module.exports = mainRouter;
