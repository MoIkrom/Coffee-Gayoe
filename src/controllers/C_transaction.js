const { getTransactions, historyTransactions, createTransactions, editTransactions, deleteTransactions } = require("../repo/R_transaction");
const sendResponse = require("../helpers/response");
const { payment, notifikasi } = require("../helpers/midTrans");

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
  midTransNotif: async (req, res) => {
    try {
      const result = await notifikasi(req.body);
      let transactionId = result.order_id;
      let transactionStatus = result.transaction_status;
      let fraudStatus = result.fraud_status;

      if (transactionStatus === "capture") {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus === "challenge") {
          // TODO set transaction status on your databaase to 'challenge'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "challenge",
            // updatedAt :
          };
          // simpan data ke database menggunakan transaction id
        } else if (fraudStatus === "accept") {
          // TODO set transaction status on your databaase to 'success'
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "Success",
            // updatedAt :
          };
          // simpan data ke database menggunakan transaction id
        }
      } else if (transactionStatus === "settlement") {
        // TODO set transaction status on your databaase to 'success'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "Success",
          // updatedAt :
        };
        // simpan data ke database menggunakan transaction id
      } else if (transactionStatus === "deny") {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt :
        };
        // simpan data ke database menggunakan transaction id
      } else if (transactionStatus === "cancel" || transactionStatus === "expire") {
        // TODO set transaction status on your databaase to 'failure'
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "failed",
          // updatedAt :
        };
        // simpan data ke database menggunakan transaction id
      } else if (transactionStatus === "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "pending",
          // updatedAt :
        };
        // simpan data ke database menggunakan transaction id
      }
      sendResponse.success(res, 200, {
        msg: " Succeess Update Status Booking",
        data: { transactionId, statusPayment: transactionStatus },
      });
    } catch (error) {
      console.log(error);
      sendResponse.error(res, 500, "Internal Server Error");
    }
  },
};
