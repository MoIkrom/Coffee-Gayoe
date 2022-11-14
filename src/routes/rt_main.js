const express = require("express");

const mainRouter = express.Router();

//menghubungkan router ke product
const productRouter = require("./rt_product");
const usersRouter = require("./rt_users");
const transactionsRouter = require("./rt_transaction");
const voucherRouter = require("./rt_promo");
const authRouter = require("./rt_authentication");
const prefix = "/api/v1";
const { memoryUpload, errorHandler } = require("../middlewares/M_upload");
const cloudinaryUploader = require("../middlewares/M_cloudinary");
// const cloudinaryUploaderProfile = require("../middlewares/M_cloudinary_profile");

//import middleware
// const imageUpload = require('../middleware/upload');

//menayambungkan main router ke sub router
mainRouter.use(`${prefix}/product`, productRouter);
mainRouter.use(`${prefix}/users`, usersRouter);
mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/transactions`, transactionsRouter);
mainRouter.use(`${prefix}/promo`, voucherRouter);
mainRouter.get("/", (req, res) => {
  res.json({
    msg: "sudah berjalan dan berhasil",
  });
});
mainRouter.post(
  "/cloud",
  (req, res, next) =>
    memoryUpload.single("image")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  cloudinaryUploader,
  (req, res) => {
    // console.log(req.file);
    res.status(200).json({
      msg: "Upload Success",
      data: {
        url: req.file.url,
        secure: req.file.secure_url,
      },
    });
  }
);

//export
module.exports = mainRouter;

// ===========================================================

// // import express kedalam variabel Main Router
// const mainRouter = require("express").Router();

// // import subrouter
// // const productRouter = require("./rt_product");
// const promoRouter = require("./rt_promo");
// const transactionsRouter = require("./rt_transaction");
// const usersRouter = require("./rt_users");
// const authRouter = require("./rt_authentication");
// const profileRouter = require("./rt_profile");
// // const categoryRouter = require("./rt_category");

// // variabel prefix
// const prefix = "/api/v1";

// // sambungkan subrouter dengan mainRouter
// // mainRouter.use(`${prefix}/products`, productRouter);
// mainRouter.use(`${prefix}/promos`, promoRouter);
// mainRouter.use(`${prefix}/transactions`, transactionsRouter);
// mainRouter.use(`${prefix}/users`, usersRouter);
// mainRouter.use(`${prefix}/auth`, authRouter);
// mainRouter.use(`${prefix}/profile`, profileRouter);

// // import middleware Upload
// const uploadMiddleware = require("../middlewares/M_upload");
// // const { json } = require("express");
// mainRouter.post("/", uploadMiddleware.single("image"), (req, res) => {
//   console.log(req.file);
//   res.json({
//     url: `/image/$(req.file.filename)`,
//   });
// });

// module.exports = mainRouter;

// // mainRouter.post(`/upload`, imageUpload.single("image"), (req, res) => {
// //   res.json({
// //       url: `/images/${req.file.filename}`,
// //   });
// // });
