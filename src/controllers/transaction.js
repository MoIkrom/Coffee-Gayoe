const transactionRepo = require("../repo/transaction");

module.exports = {
  get: async (req, res) => {
    try {
      console.log("test");
      const response = await transactionRepo.getTransaction();
      res.status(200).json({
        result: response.rows,
      });
    } catch (err) {
      res.status(500).json({
        msg: "Internal Server Error",
      });
    }
  },
  create: async (req, res) => {
    try {
      const response = await transactionRepo.createTransaction(req.body);
      res.status(201).json({
        result: response,
      });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  edit: async (req, res) => {
    try {
      const response = await transactionRepo.editTransaction(req.body, req.params);
      res.status(200).json({ result: response });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const result = await transactionRepo.deleteTransaction(req.params);
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
