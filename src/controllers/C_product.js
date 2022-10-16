const productRepo = require("../repo/R_product");

module.exports = {
  get: async (req, res) => {
    try {
      const response = await productRepo.getProduct(req.query);
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
      const response = await productRepo.createProduct(req.body);
      res.status(201).json({
        result: response,
      });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  edit: async (req, res) => {
    try {
      const response = await productRepo.editProduct(req.body, req.params);
      res.status(200).json({ result: response });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const result = await productRepo.deleteProduct(req.params);
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
