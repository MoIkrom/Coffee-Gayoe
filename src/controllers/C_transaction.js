const wrapper = require("../helpers/wrapper");
const {
  getAllTransactions,
  getCountTransactions,
  getTransactionDetails,
  createTransactions,
  getCountHistory,
  getHistory,
} = require("../repo/R_transaction");

module.exports = {
  getTransaction: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = +page || 1;
      limit = +limit || 4;
      const totalData = await getCountTransactions();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, totalPage, limit, totalData };
      const offset = page * limit - limit;

      const result = await getAllTransactions(offset, limit);
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  createTransaction: async (req, res) => {
    try {
      const { user_id, items, total_belanja, status } = req.body;

      // Menyusun data untuk transaksi utama
      const setData = {
        user_id,
        total_belanja,
        status,
      };

      // Insert transaksi utama ke tabel transactions
      const result = await createTransactions(setData, items);

      // Mendapatkan detail transaksi yang telah disimpan beserta item terkait
      const transactionDetails = await getTransactionDetails(
        result.transaction.id
      );

      return wrapper.response(
        res,
        200,
        "Transaction Success",
        transactionDetails
      );
    } catch (error) {
      console.error(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
  getHistory: async (req, res) => {
    const id = req.params.id;
    try {
      let { page, limit } = req.query;
      page = +page || 1;
      limit = +limit || 4;
      const totalData = await getCountHistory();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, totalPage, limit, totalData };
      const offset = page * limit - limit;

      const result = await getHistory(id, offset, limit);
      return wrapper.response(
        res,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};
