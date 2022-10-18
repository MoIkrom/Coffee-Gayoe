const { getProducts, getSingleProductFromServer, findProduct, searchProduct, findPromotion, createNewProduct, deleteProduct, updateProduct } = require("../repo/R_product");
const { successResponse, errorResponse } = require("../helpers/response");

module.exports = {
  getAllProducts: (req, res) => {
    getProducts(req.query)
      .then((result) => {
        const { totalData, totalPage, data, nextPage, prevPage, currentPage } = result;
        const meta = {
          totalData: totalData,
          totalPage: totalPage,
          currentPage: currentPage,
          next: nextPage,
          prev: prevPage,
        };
        successResponse(res, 200, data, meta);
      })
      .catch((error) => {
        errorResponse(res, 500, error);
      });
  },
  getProductById: (req, res) => {
    const id = req.params.id;
    getSingleProductFromServer(id)
      .then(({ data }) => {
        res.status(200).json({
          data,
          err: null,
        });
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
  findProductByQuery: (req, res) => {
    findProduct(req.query)
      .then(({ data, total }) => {
        successResponse(res, 200, data, total);
      })
      .catch(({ status, err }) => {
        errorResponse(res, status, err);
      });
  },
  searchProductByQuery: (req, res) => {
    searchProduct(req.query)
      .then(({ data, total }) => {
        successResponse(res, 200, data, total);
      })
      .catch(({ status, err }) => {
        errorResponse(res, status, err);
      });
  },
  findPromotionByQuery: (req, res) => {
    findPromotion(req.query)
      .then(({ data, total }) => {
        successResponse(res, 200, data, total);
      })
      .catch(({ status, err }) => {
        errorResponse(res, status, err);
      });
  },
  postNewProduct: (req, res) => {
    createNewProduct(req.body)
      .then(({ data }) => {
        res.status(200).json({
          message: "Product Created",
          data,
        });
      })
      .catch(({ status, err }) => {
        res.status(status).json({
          err,
          data: [],
        });
      });
  },
  deleteProductById: (req, res) => {
    const id = req.params.id;
    deleteProduct(id)
      .then(({ data }) => {
        res.status(200).json({
          data: data.rowCount,
          msg: "Delete Success",
          err: null,
        });
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
  updateProductById: (req, res) => {
    const id = req.params.id;
    updateProduct(id, req.body)
      .then(({ data }) => {
        res.status(200).json({
          data: data.rowCount,
          msg: "Update Success",
          err: null,
        });
      })
      .catch((error) => {
        const { err, status } = error;
        errorResponse(res, status, err);
      });
  },
};
