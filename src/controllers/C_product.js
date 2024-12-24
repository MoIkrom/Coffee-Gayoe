const wrapper = require("../helpers/wrapper");
const fs = require("fs");
const path = require("path");
const {
  getAllProduct,
  getCountProduct,
  newProduct,
  editProduct,
  getProductbyId,
  deleteProduct,
} = require("../repo/R_product");

module.exports = {
  getAllProduct: async (request, response) => {
    try {
      let { page, limit, sortField, sortOrder, search, category } =
        request.query;

      // Parsing dan nilai default
      page = +page || 1;
      limit = +limit || 4;
      sortField = sortField || "id"; // Kolom default untuk sorting
      sortOrder = sortOrder || "asc"; // Urutan default (ascending)
      category = category || ""; // Default tidak ada pencarian
      search = search || ""; // Default tidak ada pencarian

      // Hitung total data (dengan pencarian jika ada)
      const totalData = await getCountProduct(search, category);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, totalPage, limit, totalData };

      // Hitung offset untuk pagination
      const offset = page * limit - limit;

      // Ambil data produk dengan pagination, sort, dan search
      const result = await getAllProduct(
        offset,
        limit,
        sortField,
        sortOrder,
        search,
        category
      );

      return wrapper.response(
        response,
        result.status,
        result.data.length > 0 ? "Success Get Data !" : "Data Not found !",
        result.data,
        pagination
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  createProduct: async (req, res) => {
    try {
      const { product_name, price, stock, size, category, description } =
        req.body;

      if (!req.file) {
        const {
          status = 422,
          statusText = "Image must be Filled",
          error: errorData = null,
        } = error;

        return wrapper.response(res, status, statusText, errorData);
      }

      // Ambil path file yang diupload
      const image = req.file.path;

      const setData = {
        product_name,
        price,
        stock,
        size,
        category,
        image,
        description,
      };
      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await newProduct(setData);

      return wrapper.response(
        res,
        result.status,
        "Success Create New Product",
        result.data
      );
    } catch (error) {
      console.error(error);
      // Jika ada error, hapus file gambar yang telah diupload
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting uploaded file:", err);
          }
        });
      }
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      return wrapper.response(res, status, statusText, errorData);
    }
  },

  editProduct: async (request, response) => {
    try {
      // Ambil data produk berdasarkan id
      const { id } = request.params;
      const product = await getProductbyId(id); // Fungsi ini harus mengambil produk berdasarkan ID
      let imagePath = product.data;
      if (imagePath.length < 1) {
        // Jika ada error, hapus file gambar yang telah diupload
        if (request.file) {
          fs.unlink(request.file.path, (err) => {
            if (err) {
              console.error("Error deleting uploaded file:", err);
            }
          });
        }
        return wrapper.response(
          response,
          404,
          `Product with ID ${id} not found`,
          null
        );
      }
      const { product_name, stock, category, size, price, description } =
        request.body;

      // Cek apakah ada gambar yang di-upload
      if (request.file) {
        // Hapus gambar lama jika ada gambar baru
        const oldImagePath = path.join(
          __dirname,
          "..",
          "..",
          product.data[0].image
        );
        // Mengambil path gambar baru
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Menghapus gambar lama
        }

        // Gambar baru
        imagePath = request.file.path; // Path gambar baru yang di-upload
      }

      const setData = {
        product_name,
        stock,
        category,
        size,
        image: imagePath,
        price,
        description,
      };
      const result = await editProduct(id, setData);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }
      return wrapper.response(
        response,
        result.status,
        "Success Update Data !",
        result.data
      );
    } catch (error) {
      console.log(error);

      // Jika ada error, hapus file gambar yang telah diupload
      if (request.file) {
        fs.unlink(request.file.path, (err) => {
          if (err) {
            console.error("Error deleting uploaded file:", error);
          }
        });
      }

      // Tangani error lainnya
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;

      // Kembalikan respons error
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getProductbyId: async (request, response) => {
    const { id } = request.params;
    try {
      const result = await getProductbyId(id);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Product by Id !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  deleteProduct: async (request, response) => {
    try {
      const { id } = request.params;

      // 1. Ambil data produk berdasarkan ID
      const product = await getProductbyId(id);
      if (!product) {
        return res.status(404).json({
          status: 404,
          msg: "Product not found",
        });
      }
      // 2. Hapus file gambar jika ada
      if (product.image) {
        const imagePath = path.join(
          __dirname,
          "../public/uploads",
          product.image
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Hapus file
        }
      }

      // 3. Hapus produk dari database
      await deleteProduct(id);

      return res.status(200).json({
        status: 200,
        msg: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
