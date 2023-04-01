const otpGenerator = require("otp-generator");
const sendResponse = require("../helpers/response");
const { sendMail } = require("../helpers/mail");
const { getUsers, getUsersById, createUsers, profile, editUsers, editPassword, deleteUsers, getUserByEmail, createOTP, getOTP, AccountVerified, deleteOTP } = require("../repo/R_users");

module.exports = {
  get: async (req, res) => {
    try {
      const response = await getUsers();
      res.status(200).json({
        result: response.rows,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Internal server Error",
      });
    }
  },
  getProfile: async (req, res) => {
    try {
      const response = await getUsersById(req.userPayload.user_id);
      sendResponse.success(res, 200, {
        result: response.rows,
      });
    } catch (err) {
      console.log(err);
      sendResponse.error(res, 500, "Server Internal Error");
    }
  },

  // Register User
  create: async (req, res) => {
    try {
      const { email, username, password } = await req.body;

      // VALIDASI EMAIL
      const validateEmail = () => email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/);

      if (!validateEmail(email)) {
        return sendResponse.error(res, 400, "Incorrect Email");
      }

      // PROSES VALIDASI PASSWORD
      if (password.length < 6) {
        return sendResponse.error(res, 400, "Password At Least 6 Character ", null);
      }

      // PROSES PENGECEKAN DUPLIKASI EMAIL
      const checkEmail = await getUserByEmail(email);
      // console.log(checkEmail.rowCount);
      if (checkEmail.rowCount > 1) {
        return sendResponse.error(res, 403, "Email Already Registered", null);
      }

      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const response = await createUsers(req.body);
      const id = response.rows[0].id;

      // GENERATE OTP
      const OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      await createOTP(OTP, id);

      const sendMailOptions = {
        to: email,
        name: `${username}`,
        subject: "Email Verification !",
        template: "verificationEmail.html",
        buttonUrl: `https://coffee-gayoe.vercel.app/users/verify/${id}`,
        OTP,
      };
      sendMail(sendMailOptions);

      sendResponse.success(res, 200, {
        msg: "create success",
        data: response.rows,
      });
    } catch (err) {
      console.log(err);
      sendResponse.error(res, 500, "Internal Server Error");
    }
  },
  verify: async (req, res) => {
    try {
      const { id } = await req.params;
      const { otp } = await req.body;

      // PROSES PENGECEKAN OTP
      const verifyOTP = await getOTP(id);
      if (otp === verifyOTP) {
        await AccountVerified(id);
        await deleteOTP(id);
        return sendResponse.success(res, 200, {
          msg: "Verify Success ",
        });
      }
    } catch (error) {
      console.log(error);
      return sendResponse.error(res, 500, "Wrong Input OTP");
    }
  },
  profile: async (req, res) => {
    try {
      if (req.file) {
        var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
        req.body.image = req.file.secure_url;
      }

      const response = await profile(req.body, req.userPayload.user_id);
      sendResponse.success(res, 200, {
        msg: "Edit Profile Success",
        data: response.rows,
        filename: image,
        filename: image,
      });
    } catch (err) {
      console.log(err);
      sendResponse.error(res, 500, "internal server error");
    }
  },

  edit: async (req, res) => {
    try {
      const response = await editUsers(req.body, req.userPayload.user_id, req.file);
      sendResponse.success(res, 200, {
        msg: "edit Profile success",
        data: response.rows,
        // filename: image,
      });
    } catch (err) {
      sendResponse.error(res, 500, "Internal Server Error");
      console.log(err);
    }
  },
  editPassword: async (req, res) => {
    try {
      const response = await editPassword(req.body, req.userPayload.user_id);
      sendResponse.success(res, 200, {
        msg: (response.text = "Password has been changed"),
        data: null,
      });
    } catch (obJerr) {
      const statusCode = obJerr.statusCode || 500;
      sendResponse.error(res, statusCode, { msg: obJerr.err.message });
    }
  },
  drop: async (req, res) => {
    try {
      const result = await deleteUsers(req.params);
      sendResponse.success(res, 200, {
        msg: "Delete Success",
        data: result.rows,
      });
    } catch (obJerr) {
      const statusCode = obJerr.statusCode || 500;
      sendResponse.error(res, statusCode, " Internal Server Error");
    }
  },
};
