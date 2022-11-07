const productRepo = require("../repo/R_product");
const sendResponse = require("../helpers/response");

const create = async (req, res) => {
  try {
    const image = `/images/${req.file.filename}`;

    const response = await productRepo.createProduct(req.body, image);
    sendResponse.success(res, 200, {
      msg: (response.text = "Create Succes"),
      data: response.rows,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "Internal Server Error");
  }
};

const edit = async (req, res) => {
  try {
    if (req.file) {
      const image = `/images/${req.file.filename}`;
      req.body.image = image;
    }

    const response = await productRepo.editProduct(req.body, req.params);
    const image = `/images/${req.file.filename}`;
    response.rows[0].image = image;
    sendResponse.success(res, 200, {
      msg: "Product has been change",
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(res, 500, "Internal Server Error");
  }
};
const drop = async (req, res) => {
  try {
    const result = await productRepo.deleteProduct(req.params);
    sendResponse.success(res, 200, {
      msg: "Product has been deleted",
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, " Internal Server Error");
  }
};
const search = async (req, res) => {
  try {
    const response = await productRepo.searchProduct(req.query);
    res.status(200).json({
      msg: "Success Get Data",
      data: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
};

const productControler = {
  create,
  search,
  edit,
  drop,
};

module.exports = productControler;

// ==============================================================

// const { getProducts, getSingleProductFromServer, findProduct, searchProduct, findPromotion, createNewProduct, deleteProduct, updateProduct } = require("../repo/R_product");
// const { successResponse, errorResponse } = require("../helpers/response");

// module.exports = {
//   getAllProducts: (req, res) => {
//     getProducts(req.query)
//       .then((result) => {
//         const { totalData, totalPage, data, nextPage, prevPage, currentPage } = result;
//         const meta = {
//           data: data,
//           totalData: totalData,
//           totalPage: totalPage,
//           currentPage: currentPage,
//           // next: resNext,
//           // prev: prevPage,
//           next: nextPage,
//           prev: prevPage,
//         };

//         successResponse(res, 200, meta);
//       })
//       .catch((error) => {
//         errorResponse(res, 500, error);
//       });
//   },
//   getProductById: (req, res) => {
//     const id = req.params.id;
//     getSingleProductFromServer(id)
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
//   findProductByQuery: (req, res) => {
//     findProduct(req.query)
//       .then(({ data, total }) => {
//         successResponse(res, 200, data, total);
//       })
//       .catch(({ status, err }) => {
//         errorResponse(res, status, err);
//       });
//   },
//   searchProductByQuery: (req, res) => {
//     searchProduct(req.query)
//       .then(({ data, total }) => {
//         successResponse(res, 200, data, total);
//       })
//       .catch(({ status, err }) => {
//         errorResponse(res, status, err);
//       });
//   },
//   findPromotionByQuery: (req, res) => {
//     findPromotion(req.query)
//       .then(({ data, total }) => {
//         successResponse(res, 200, data, total);
//       })
//       .catch(({ status, err }) => {
//         errorResponse(res, status, err);
//       });
//   },
//   postNewProduct: (req, res) => {
//     createNewProduct(req.body)
//       .then(({ data }) => {
//         res.status(200).json({
//           message: "Product Created",
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
//   deleteProductById: (req, res) => {
//     const id = req.params.id;
//     deleteProduct(id)
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
//   updateProductById: (req, res) => {
//     const id = req.params.id;
//     updateProduct(id, req.body)
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
