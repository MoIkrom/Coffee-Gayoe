const repoTransaction = require("../repo/R_transaction");
const sendResponse = require("../helpers/response");
const { payment } = require("../helpers/midTrans");

//Get
const get = async (req, res) => {
  try {
    const response = await repoTransaction.getTransactions();
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
};

const history = async (req, res) => {
  try {
    const response = await repoTransaction.historyTransactions(req.query, req.userPayload.user_id);
    // console.log(response);
    sendResponse.success(res, 200, response);
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, err.message);
  }
};

const create = async (req, res) => {
  try {
    const response = await repoTransaction.createTransactions(req.body, req.userPayload.user_id);
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
};
const edit = async (req, res) => {
  try {
    const response = await repoTransaction.editTransactions(req.body, req.params);
    sendResponse.success(res, 200, {
      msg: (response.text = "Transaction has been change"),
    });
  } catch (err) {
    sendResponse.error(res, 500, "Internal Server Error");
  }
};
const drop = async (req, res) => {
  try {
    const result = await repoTransaction.deleteTransactions(req.params);
    sendResponse.success(res, 200, {
      msg: "Delete Success",
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, " Internal Server Error");
  }
};
const transactionsControler = {
  get,
  create,
  edit,
  drop,
  history,
};

module.exports = transactionsControler;

// ===================================================================

// const repoTransaction = require("../repo/R_transaction");
// const sendResponse = require("../helpers/response");
// //Get
// const get = async (req, res) => {
//   try {
//     const response = await repoTransaction.getTransactions();
//     res.status(200).json({
//       result: response.rows,
//     });
//   } catch (error) {
//     res.status(500).json({
//       msg: "Internal server Error",
//     });
//   }
// };
// const create = async (req, res) => {
//   try {
//     const response = await repoTransaction.createTransactions(req.body);
//     sendResponse.success(res, 200, {
//       msg: (response.text = "Create Succes"),
//       data: response.rows,
//     });
//   } catch (err) {
//     sendResponse.error(res, 500, "Internal Server Error");
//   }
// };
// const edit = async (req, res) => {
//   try {
//     const response = await repoTransaction.editTransactions(req.body, req.params);
//     sendResponse.success(res, 200, {
//       msg: (response.text = "Transaction has been change"),
//     });
//   } catch (err) {
//     sendResponse.error(res, 500, "Internal Server Error");
//   }
// };
// const drop = async (req, res) => {
//   try {
//     const result = await repoTransaction.deleteTransactions(req.params);
//     sendResponse.success(res, 200, {
//       msg: "Delete Success",
//       data: result.rows,
//     });
//   } catch (obJerr) {
//     const statusCode = obJerr.statusCode || 500;
//     sendResponse.error(res, statusCode, " Internal Server Error");
//   }
// };
// const transactionsControler = {
//   get,
//   create,
//   edit,
//   drop,
// };

// module.exports = transactionsControler;

// =========================================================

// const { getTransaction, getSingleTransactionFromServer, createNewTransaction, deleteTransaction, updateTransaction } = require("../repo/R_transaction");
// const { successResponse, errorResponse } = require("../helpers/response");

// module.exports = {
//   getAllTransaction: (req, res) => {
//     getTransaction(req.query)
//       .then((result) => {
//         const { totalData, totalPage, data, nextPage, prevPage, currentPage } = result;
//         const meta = {
//           totalData,
//           totalPage,
//           currentPage: currentPage,
//           next: nextPage,
//           prev: prevPage,
//         };
//         successResponse(res, 200, data, meta);
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, 500, err);
//       });
//   },
//   getTransactionById: (req, res) => {
//     const id = req.params.id;
//     getSingleTransactionFromServer(id)
//       .then(({ data }) => {
//         res.status(200).json({
//           data,
//           err: null,
//         });
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
//   postNewTransaction: (req, res) => {
//     createNewTransaction(req.body)
//       .then(({ data }) => {
//         res.status(200).json({
//           err: null,
//           data,
//         });
//       })
//       .catch(({ status, err }) => {
//         res.status(status).json({
//           err,
//           data: [],
//         });
//       });
//   },
//   deleteTransactionById: (req, res) => {
//     const id = req.params.id;
//     deleteTransaction(id)
//       .then(({ data }) => {
//         res.status(200).json({
//           data: data.rowCount,
//           msg: "Delete Success",
//           err: null,
//         });
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
//   updateTransactionById: (req, res) => {
//     const id = req.params.id;
//     updateTransaction(id, req.body)
//       .then(({ data }) => {
//         res.status(200).json({
//           data: data.rowCount,
//           msg: "Update Success",
//           err: null,
//         });
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
// };
