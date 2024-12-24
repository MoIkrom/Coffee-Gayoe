const express = require("express");

const transactionstRouter = express.Router();

const {
  createTransaction,
  getTransaction,
  getHistory,
} = require("../controllers/C_transaction");

transactionstRouter.get("/", getTransaction);
transactionstRouter.post("/", createTransaction);
transactionstRouter.get("/history/:id", getHistory);
// transactionstRouter.post("/", isLogin(), allowedRole("admin", "user"), create);
// transactionstRouter.patch("/:id", isLogin(), allowedRole("admin"), edit);
// transactionstRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

module.exports = transactionstRouter;
