const express = require("express");
const promoRouter = express.Router();
const { get, create, edit, drop } = require("../controllers/C_promo");

promoRouter.get("/", get);
promoRouter.post("/", create);
promoRouter.patch("/:id", edit);
promoRouter.delete("/:id", drop);

module.exports = promoRouter;

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

// module.exports = Router;
