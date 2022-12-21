const express = require("express");

const transactionstRouter = express.Router();
const isLogin = require("../middlewares/isLogin");
const allowedRole = require("../middlewares/M_allowedRole");

const { get, create, history, edit, drop } = require("../controllers/C_transaction");

transactionstRouter.get("/", get);
transactionstRouter.get("/history", isLogin(), allowedRole("user"), history);
transactionstRouter.post("/", isLogin(), allowedRole("admin", "user"), create);
transactionstRouter.patch("/:id", isLogin(), allowedRole("admin"), edit);
transactionstRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

module.exports = transactionstRouter;

// =================================================================

// const express = require("express");

// const transactionstRouter = express.Router();
// const isLogin = require("../middlewares/isLogin");
// const allowedRole = require("../middlewares/M_allowedRole");

// const { get, create, edit, drop } = require("../controllers/C_transaction");

// transactionstRouter.get("/", get);
// transactionstRouter.post("/", isLogin(), allowedRole("admin"), create);
// transactionstRouter.patch("/:id", isLogin(), allowedRole("admin"), edit);
// transactionstRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

// module.exports = transactionstRouter;

// ===================================

// const express = require("express");
// const transactionRouter = express.Router();
// const { getAllTransaction, getTransactionById, postNewTransaction, deleteTransactionById, updateTransactionById } = require("../controllers/C_transaction");
// const validate = require("../middlewares/M_validate");
// const { checkToken } = require("../middlewares/M_authentication");

// transactionRouter.get("/all", getAllTransaction);
// transactionRouter.get("/:id", getTransactionById);
// // transactionRouter.post("/", checkToken, validate.transactionData, postNewTransaction);
// transactionRouter.delete("/:id", deleteTransactionById);
// transactionRouter.patch("/:id", updateTransactionById);

// module.exports = transactionRouter;
