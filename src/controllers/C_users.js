const repoUsers = require("../repo/R_users");
const sendResponse = require("../helpers/response");
const { sendMail } = require("../helpers/mail");

const get = async (req, res) => {
  try {
    const response = await repoUsers.getUsers();
    res.status(200).json({
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server Error",
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const response = await repoUsers.getUsersById(req.userPayload.user_id);
    sendResponse.success(res, 200, {
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "Server Internal Error");
  }
};

// Register User
const create = async (req, res) => {
  try {
    const response = await repoUsers.createUsers(req.body);
    const { email, firstname, lastname } = await req.body;

    const sendMailOptions = {
      to: email,
      name: `${firstname} ${lastname}`,
      subject: "Email Verification !",
      template: "verificationEmail.html",
      buttonUrl: "https://sinau-app.vercel.app/",
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
};
const profile = async (req, res) => {
  try {
    if (req.file) {
      var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
      req.body.image = req.file.secure_url;
    }

    const response = await repoUsers.profile(req.body, req.userPayload.user_id);
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
};

const edit = async (req, res) => {
  try {
    const response = await repoUsers.editUsers(req.body, req.userPayload.user_id, req.file);
    // const response = await repoUsers.editUsers(req.body, req.userPayload.user_id, req.file);
    sendResponse.success(res, 200, {
      msg: "edit Profile success",
      data: response.rows,
      // filename: image,
    });
  } catch (err) {
    sendResponse.error(res, 500, "Internal Server Error");
    console.log(err);
  }
};
const editPassword = async (req, res) => {
  try {
    const response = await repoUsers.editPassword(req.body, req.userPayload.user_id);
    sendResponse.success(res, 200, {
      msg: (response.text = "Password has been changed"),
      data: null,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, { msg: obJerr.err.message });
  }
};
const drop = async (req, res) => {
  try {
    const result = await repoUsers.deleteUsers(req.params);
    sendResponse.success(res, 200, {
      msg: "Delete Success",
      data: result.rows,
    });
  } catch (obJerr) {
    const statusCode = obJerr.statusCode || 500;
    sendResponse.error(res, statusCode, " Internal Server Error");
  }
};
const UsersControler = {
  get,
  create,
  edit,
  editPassword,
  drop,
  getProfile,
  profile,
};

module.exports = UsersControler;
