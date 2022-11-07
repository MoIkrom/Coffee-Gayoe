const repovoucher = require("../repo/R_promo");
const sendResponse = require("../helpers/response");
//Get
const get = async (req, res) => {
  try {
    const response = await repovoucher.getvoucher();
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
};
const create = async (req, res) => {
  try {
    const response = await repovoucher.createvoucher(req.body);
    sendResponse.success(res, 200, {
      msg: (response.text = "Create Succes"),
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(res, 500, "Internal Server Error");
  }
};
const edit = async (req, res) => {
  try {
    const response = await repovoucher.editvoucher(req.body, req.params);
    sendResponse.success(res, 200, {
      msg: (response.text = "Promo has been change"),
    });
  } catch (err) {
    sendResponse.error(res, 500, "Internal Server Error");
  }
};
const drop = async (req, res) => {
  try {
    const result = await repovoucher.deletevoucher(req.params);
    sendResponse.success(res, 200, {
      msg: "Delete Success",
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, " Internal Server Error");
  }
};
const search = async (req, res) => {
  try {
    const response = await repovoucher.searchvoucher(req.query);
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
};
const voucherControler = {
  get,
  create,
  edit,
  drop,
  search,
};

module.exports = voucherControler;

// ===================================================

// const promoRepo = require("../repo/R_promo");

// module.exports = {
//   get: async (req, res) => {
//     try {
//       const response = await promoRepo.getPromo(req.query);
//       res.status(200).json({
//         result: response.rows,
//       });
//     } catch (err) {
//       res.status(500).json({
//         msg: "Internal Server Error",
//       });
//     }
//   },
//   create: async (req, res) => {
//     try {
//       const response = await promoRepo.createPromo(req.body);
//       res.status(201).json({
//         result: response,
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
//   edit: async (req, res) => {
//     try {
//       const response = await promoRepo.editPromo(req.body, req.params);
//       res.status(200).json({ result: response });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
//   drop: async (req, res) => {
//     try {
//       const result = await promoRepo.deletePromo(req.params);
//       res.status(200).json({ result });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
// };

// const promoRepo = require("../repo/R_promo");
// const { getPromotion, getSinglePromotionFromServer, createNewPromotion, deletePromotion, updatePromotion } = promoRepo;
// const { successResponse, errorResponse } = require("../helpers/response");
// //

// module.exports = {
//   getAllPromotions: (req, res) => {
//     getPromotion(req.query)
//       .then((result) => {
//         const { totalData, totalPage, data } = result;
//         const meta = {
//           totalData,
//           totalPage,
//           route: `/promotion${req.route.path}?)`,
//           query: req.query,
//           page: Number(req.query.page),
//         };
//         successResponse(res, 200, data, meta);
//       })
//       .catch((error) => {
//         console.log(error);
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
//   getPromotionById: (req, res) => {
//     const id = req.params.id;
//     getSinglePromotionFromServer(id)
//       .then(({ data }) => {
//         res.status(200).json({
//           data,
//           err: null,
//         });
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
//   postNewPromotion: (req, res) => {
//     const { file } = req;
//     let image;
//     if (file) {
//       image = file.path.replace("public", "").replace(/\\/g, "/");
//     }
//     createNewPromotion(req.body, image)
//       .then(({ data }) => {
//         res.status(200).json({
//           meassage: "Promotion Created",
//           data,
//         });
//       })
//       .catch(({ status, err }) => {
//         res.status(status).json({
//           err,
//           data: [],
//         });
//       });
//   },
//   deletePromotionById: (req, res) => {
//     const id = req.params.id;
//     deletePromotion(id)
//       .then(({ data }) => {
//         res.status(200).json({
//           data: data.rowCount,
//           msg: "Delete Success",
//           err: null,
//         });
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
//   updatePromotionById: (req, res) => {
//     const id = req.params.id;
//     updatePromotion(id, req.body)
//       .then(({ data }) => {
//         res.status(200).json({
//           data: data.rowCount,
//           msg: "Update Success",
//           err: null,
//         });
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
// };
