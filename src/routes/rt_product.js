const express = require("express");
const multer = require("multer");
const productRouter = express.Router();
const isLogin = require("../middlewares/isLogin");
const allowedRole = require("../middlewares/M_allowedRole");
const { memoryUpload, errorHandler } = require("../middlewares/M_upload");
const cloudinary = require("../middlewares/M_cloudinary");

function uploadFile(req, res, next) {
  const upload = memoryUpload.single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log(err);
      res.json("Size image maximal 4mb");
    } else if (err) {
      // Error File format
      res.json("Format image Wrong!");
    }
    // Everything went fine.
    next();
  });
}

const { create, edit, drop, search } = require("../controllers/C_product");

productRouter.get("/", search);
productRouter.post("/", isLogin(), allowedRole("admin"), uploadFile, cloudinary, create);
productRouter.patch("/:id", isLogin(), allowedRole("admin"), uploadFile, cloudinary, edit);
productRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);
module.exports = productRouter;

// ===================================================================

// const express = require("express");
// const productRouter = express.Router();
// const isLogin = require("../middlewares/isLogin");
// const allowedRole = require("../middlewares/M_allowedRole");
// const multer = require("multer");
// const imageUpload = require("../middlewares/M_upload");
// const { getAllProducts, getProductById, findProductByQuery, searchProductByQuery, findPromotionByQuery, postNewProduct, deleteProductById, updateProductById } = require("../controllers/C_product");
// const validate = require("../middlewares/M_validate");
// const { checkToken } = require("../middlewares/M_authentication");
// function uploadFile(req, res, next) {
//   const upload = uploadImage.single("image");

//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       res.json("Size image minimum 3mb");
//     } else if (err) {
//       // Error File format
//       res.json("Format image Wrong!");
//     }
//     // Everything went fine.
//     next();
//   });
// }

// productRouter.get("/all", getAllProducts);
// productRouter.get("/:id", getProductById);
// productRouter.get("/", validate.queryFind, findProductByQuery);
// productRouter.get("/", searchProductByQuery);
// productRouter.get("/", findPromotionByQuery);

// productRouter.post("/", isLogin(), allowedRole("admin"), uploadFile, postNewProduct);

// productRouter.patch("/:id", imageUpload, isLogin(), allowedRole("admin"), updateProductById);
// productRouter.delete("/:id", isLogin(), allowedRole("admin"), deleteProductById);

// module.exports = productRouter;
