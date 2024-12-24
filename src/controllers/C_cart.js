const wrapper = require("../helpers/wrapper");
const { addCart } = require("../repo/R_Cart");

module.exports = {
  addCart: async (req, res) => {
    try {
      const { product_id, size, qty, delivery } = req.body;

      const setCart = {
        product_id,
        size,
        qty,
        delivery,
      };

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await addCart(setCart);

      return wrapper.response(
        res,
        result.status,
        "Success Add to Cart",
        result.data
      );
    } catch (error) {
      console.error(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },
};
