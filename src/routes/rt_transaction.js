const express = require("express");
const Router = express.Router();
const { getAllTransaction, getTransactionById, postNewTransaction, deleteTransactionById, updateTransactionById } = require("../controllers/C_transaction");
const validate = require("../middlewares/M_validate");
const { checkToken } = require("../middlewares/M_authentication");

Router.get("/all", getAllTransaction);
Router.get("/:id", getTransactionById);
Router.post("/", checkToken, validate.transactionData, postNewTransaction);
Router.delete("/:id", deleteTransactionById);
Router.patch("/:id", updateTransactionById);

module.exports = Router;
