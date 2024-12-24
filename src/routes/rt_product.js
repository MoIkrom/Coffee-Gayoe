const express = require("express");
const productRouter = express.Router();
const isLogin = require("../middlewares/isLogin");
const allowedRole = require("../middlewares/M_allowedRole");
const cloudinary = require("../middlewares/M_cloudinary");
const upload = require("../middlewares/M_upload");

const {
  getAllProduct,
  createProduct,
  editProduct,
  getProductbyId,
  deleteProduct,
} = require("../controllers/C_product");

productRouter.get("/", getAllProduct);
productRouter.post("/", upload.single("image"), createProduct);
productRouter.put("/:id", upload.single("image"), editProduct);
productRouter.get("/:id", getProductbyId);
productRouter.delete("/:id", deleteProduct);
module.exports = productRouter;
