const productRepo = require("../repo/product");

const get = async (req, res) => {
  try {
    const response = await productRepo.getProduct();
    res.status(200).json({
      result: response.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};
const create = async (req, res) => {
  try {
    const response = await productRepo.createProduct(req.body);
    res.status(201).json({
      result: response,
    });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const edit = async (req, res) => {
  try {
    const response = await productRepo.editProduct(req.body, req.params);
    res.status(200).json({ result: response });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
const drop = async (req, res) => {
  try {
    const result = await productRepo.deleteProduct(req.params);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const productController = {
  get,
  create,
  edit,
  drop,
};

module.exports = productController;
