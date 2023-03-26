const { getTransactions, historyTransactions, createTransactions, editTransactions, deleteTransactions } = require("../repo/R_transaction");
const sendResponse = require("../helpers/response");
const { payment } = require("../helpers/midTrans");

module.exports = {
  get: async (req, res) => {
    try {
      const response = await getTransactions();
      res.status(200).json({
        result: response.rows,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal server Error",
      });
    }
  },

  history: async (req, res) => {
    try {
      const response = await historyTransactions(req.query, req.userPayload.user_id);
      // console.log(response);
      sendResponse.success(res, 200, response);
    } catch (err) {
      console.log(err);
      sendResponse.error(res, 500, err.message);
    }
  },

  create: async (req, res) => {
    try {
      const response = await createTransactions(req.body, req.userPayload.user_id);
      const transactionId = response.rows[0].id;
      const totalPayment = response.rows[0].total;
      const dataTransaction = {
        transactionId,
        totalPayment,
      };

      const redirect_url = await payment(dataTransaction);
      sendResponse.success(res, 200, {
        msg: (response.text = "Create Succes"),
        data: response.rows,
        redirect_url: redirect_url,
      });
    } catch (err) {
      console.log(err);
      sendResponse.error(res, 500, "Internal Server Error");
    }
  },
  edit: async (req, res) => {
    try {
      const response = await editTransactions(req.body, req.params);
      sendResponse.success(res, 200, {
        msg: (response.text = "Transaction has been change"),
      });
    } catch (err) {
      sendResponse.error(res, 500, "Internal Server Error");
    }
  },
  drop: async (req, res) => {
    try {
      const result = await deleteTransactions(req.params);
      sendResponse.success(res, 200, {
        msg: "Delete Success",
        data: result.rows,
      });
    } catch (obJerr) {
      const statusCode = obJerr.statusCode || 500;
      sendResponse.error(res, statusCode, " Internal Server Error");
    }
  },
};
