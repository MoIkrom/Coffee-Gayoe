const wrapper = require("../helpers/wrapper");
const bcrypt = require("bcrypt");
const {
  getProfile,
  getAllUser,
  getUsersById,
  Register,
  getCountUser,
  EditUser,
  EditProfile,
  deleteUser,
  RegisterProfile,
} = require("../repo/R_users");

module.exports = {
  register: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        role,
        firstname,
        lastname,
        date_of_birth,
        address,
        phone_number,
        user_id,
      } = req.body;

      // VALIDASI EMAIL
      const validateEmail = (email) =>
        email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/);

      if (!validateEmail(email)) {
        return wrapper.response(res, 400, "Email is not valid", null);
      }

      // PROSES VALIDASI PASSWORD
      if (password.length < 6) {
        return wrapper.response(
          res,
          400,
          "Password must be at least 6 characters",
          null
        );
      }

      if (password !== confirmPassword) {
        return wrapper.response(res, 400, "Password does not match", null);
      }

      // PROSES HASH PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      const setUser = {
        username,
        email,
        role,
        password: hashedPassword,
      };

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await Register(setUser);
      const setProfile = {
        user_id: result.data[0].id,
        firstname,
        lastname,
        address,
        date_of_birth,
        phone_number,
      };
      await RegisterProfile(setProfile);

      return wrapper.response(res, 201, "Register Success", result.data);
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

  getAllUser: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = +page || 1;
      limit = +limit || 4;
      const totalData = await getCountUser();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = { page, totalPage, limit, totalData };
      const offset = page * limit - limit;

      const result = await getAllUser(offset, limit);
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
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

  getProfile: async (req, res) => {
    const token = req.userPayload.user_id;
    try {
      const result = await getProfile(token);
      return wrapper.response(
        res,
        result.status,
        "Success Get Profile !",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },

  editProfile: async (req, res) => {
    try {
      // Ambil data produk berdasarkan id
      const { id } = req.params;
      const resultUser = await getProfile(id);
      const currentImage = resultUser[0].profile[0].image;

      if (resultUser.length < 1) {
        return wrapper.response(
          res,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }

      const {
        username,
        email,
        firstname,
        lastname,
        date_of_birth,
        address,
        phone_number,
      } = req.body;

      // Mengambil nama file gambar yang di-upload, jika ada
      const image = req.file ? req.file.filename : currentImage;

      // Jika ada file baru yang di-upload, hapus gambar lama
      if (req.file && currentImage) {
        const fs = require("fs");
        const imagePath = `images/${currentImage}`;

        // Hapus file gambar lama dari folder
        fs.unlinkSync(imagePath);
      }

      // Validasi email jika email tidak null
      if (email) {
        const isValidEmail = (email) =>
          /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);

        if (!isValidEmail(email)) {
          return wrapper.response(res, 400, "Email is not valid", null);
        }
      }

      const setUser = {
        username,
        email,
      };

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const updateUserResult = await EditUser(id, setUser);

      const setProfile = {
        firstname,
        lastname,
        address,
        date_of_birth,
        phone_number,
        image,
      };
      const updateProfileResult = await EditProfile(id, setProfile);

      if (updateProfileResult.error || updateUserResult.error) {
        if (req.file) {
          const fs = require("fs");
          fs.unlinkSync(`images/${req.file.filename}`); // Menghapus file yang diupload
        }
        return wrapper.response(res, 500, "Failed to update profile", null);
      }

      // Gabungkan data profil dengan username dan email
      const responseData = {
        ...updateUserResult.data[0],
        ...updateProfileResult.data[0],
      };

      // Jika berhasil, kembalikan response sukses
      return wrapper.response(res, 200, "Update Profile Success", responseData);
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(res, status, statusText, errorData);
    }
  },

  getUserbyId: async (request, response) => {
    const { id } = request.params;
    try {
      const result = await getProfile(id);
      if (result.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }

      return wrapper.response(
        response,
        200,
        "Success Get User by Id !",
        result
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

  editUser: async (request, response) => {
    try {
      const { username, email, role } = request.body;
      const { id } = request.params;
      const setData = {
        username,
        email,
        role,
      };
      const result = await EditUser(id, setData);
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
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },

  deleteUser: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await deleteUser(id);
      console.log(result);
      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data with ID '${id}' Not Found !`,
          null
        );
      }
      return wrapper.response(response, result.status, "Success Delete Data !");
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
