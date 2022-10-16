const authRepo = require("../repo/R_authentication");

module.exports = {
  get: async (req, res) => {
    try {
      const response = await authRepo.getProfile(req.query);
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
      const response = await authRepo.createProduct(req.body);
      res.status(201).json({
        result: response,
      });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  edit: async (req, res) => {
    try {
      const response = await authRepo.editProduct(req.body, req.params);
      res.status(200).json({ result: response });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  drop: async (req, res) => {
    try {
      const result = await authRepo.deleteProduct(req.params);
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
};
