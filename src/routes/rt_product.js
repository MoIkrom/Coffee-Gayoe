const express = require("express");
const productRouter = express.Router();
const { getAllProducts, getProductById, findProductByQuery, searchProductByQuery, findPromotionByQuery, postNewProduct, deleteProductById, updateProductById } = require("../controllers/C_product");
const validate = require("../middlewares/M_validate");
const { checkToken } = require("../middlewares/M_authentication");
const imageUpload = require("../middlewares/M_upload");

productRouter.get("/all", getAllProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/", validate.queryFind, findProductByQuery);
productRouter.get("/", searchProductByQuery);
productRouter.get("/", findPromotionByQuery);

productRouter.post("/", postNewProduct);

productRouter.patch("/:id", updateProductById);
productRouter.delete("/:id", deleteProductById);

module.exports = productRouter;
