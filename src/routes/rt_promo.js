const express = require("express");
const multer = require("multer");
const voucherRouter = express.Router();
const isLogin = require("../middlewares/isLogin");
const allowedRole = require("../middlewares/M_allowedRole");
const { diskUpload } = require("../middlewares/M_upload");
function uploadFile(req, res, next) {
  const upload = diskUpload.single("image");

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

const { get, create, edit, drop, search } = require("../controllers/C_promo");

voucherRouter.get("/", get);
voucherRouter.get("/search", search);
// voucherRouter.post("/", isLogin(), create);
voucherRouter.post("/", isLogin(), allowedRole("admin"), uploadFile, create);
voucherRouter.patch("/:id", isLogin(), allowedRole("admin"), uploadFile, edit);
voucherRouter.delete("/:id", isLogin(), allowedRole("admin"), drop);

module.exports = voucherRouter;

// ===============================================

// const express = require("express");
// const promoRouter = express.Router();
// const { get, create, edit, drop } = require("../controllers/C_promo");

// promoRouter.get("/", get);
// promoRouter.post("/", create);
// promoRouter.patch("/:id", edit);
// promoRouter.delete("/:id", drop);

// module.exports = promoRouter;

// const express = require("express");
// const Router = express.Router();
// const promotionController = require("../controllers/C_promo");
// const validate = require("../middlewares/M_validate");
// const { checkToken } = require("../middlewares/M_authentication");
// const imageUpload = require("../middlewares/M_upload");

// Router.get("/all", promotionController.getAllPromotions);
// Router.get("/:id", promotionController.getPromotionById);
// Router.post("/", checkToken, imageUpload.single("image"), validate.promotionData, promotionController.postNewPromotion);
// Router.delete("/:id", promotionController.deletePromotionById);
// Router.patch("/:id", promotionController.updatePromotionById);

// module.exports = Router
