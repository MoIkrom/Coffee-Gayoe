const express = require("express");

const transactionRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/C_transaction");

transactionRouter.get("/", get);
transactionRouter.post("/", create);
transactionRouter.patch("/:id", edit);
transactionRouter.delete("/:id", drop);

module.exports = transactionRouter;
