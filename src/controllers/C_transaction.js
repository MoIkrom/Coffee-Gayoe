const { getTransaction, getSingleTransactionFromServer, createNewTransaction, deleteTransaction, updateTransaction } = require("../repo/R_transaction");
const { successResponse, errorResponse } = require("../helpers/response");

module.exports = {
  getAllTransaction: (req, res) => {
    getTransaction(req.query)
      .then((result) => {
        const { totalData, totalPage, data, nextPage, prevPage, currentPage } = result;
        const meta = {
          totalData,
          totalPage,
          currentPage: currentPage,
          next: nextPage,
          prev: prevPage,
        };
        successResponse(res, 200, data, meta);
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
  getTransactionById: (req, res) => {
    const id = req.params.id;
    getSingleTransactionFromServer(id)
      .then(({ data }) => {
        res.status(200).json({
          data,
          err: null,
        });
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
  postNewTransaction: (req, res) => {
    createNewTransaction(req.body)
      .then(({ data }) => {
        res.status(200).json({
          err: null,
          data,
        });
      })
      .catch(({ status, err }) => {
        res.status(status).json({
          err,
          data: [],
        });
      });
  },
  deleteTransactionById: (req, res) => {
    const id = req.params.id;
    deleteTransaction(id)
      .then(({ data }) => {
        res.status(200).json({
          data: data.rowCount,
          msg: "Delete Success",
          err: null,
        });
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
  updateTransactionById: (req, res) => {
    const id = req.params.id;
    updateTransaction(id, req.body)
      .then(({ data }) => {
        res.status(200).json({
          data: data.rowCount,
          msg: "Update Success",
          err: null,
        });
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
};
