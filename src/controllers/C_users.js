const repoUsers = require("../repo/R_users");
const sendResponse = require("../helpers/response");

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
  // console.log(userPayload);
  try {
    const response = await repoUsers.getUsersById(req.userPayload.user_id);
    // console.log(response);
    sendResponse.success(res, 200, {
      result: response.rows,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "Server Internal Error");
  }
};
const create = async (req, res) => {
  try {
    const response = await repoUsers.createUsers(req.body);
    sendResponse.success(res, 200, {
      msg: "create success",
      data: response.rows,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "Internal Server Error");
  }
};
const edit = async (req, res) => {
  try {
    // if (req.file) {
    //   req.body.image = req.file.path;
    // }
    const response = await repoUsers.editUsers(req.body, req.userPayload.user_id, req.file.secure_url);
    // console.log(response);
    // response.rows[0].image = `/images/${req.file.filename}`;
    sendResponse.success(res, 200, {
      msg: "edit Profile success",
      data: response.rows,
    });
  } catch (err) {
    sendResponse.error(res, 500, "Internal Server Error");
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
};

module.exports = UsersControler;

// ============================================

// const usersRepo = require("../repo/R_users");

// module.exports = {
//   register: (req, res) => {
//     const { body } = req;
//     usersRepo
//       .register(body)
//       .then((response) => {
//         res.status(201).json({
//           msg: "Register Success",
//           data: {
//             ...response.rows[0],
//             email: body.email,
//             display_name: body.display_name,
//           },
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({ msg: "Internal Server Error", error: err.message });
//       });
//   },
//   editPassword: (req, res) => {
//     const { body } = req;
//     usersRepo
//       .editPassword(body)
//       .then((res) => {
//         res.status(200).json({
//           msg: "Password has been changed",
//           data: null,
//         });
//       })
//       .catch((objErr) => {
//         const statusCode = objErr.statusCode || 500;
//         res.status(statusCode).json({ msg: objErr.err.message });
//       });
//   },
//   createNewProfile: async (req, res) => {
//     console.log(req);
//     usersRepo
//       .createProfile(req.body, req.userPayload)
//       .then((response) => {
//         res.status(201).json({
//           msg: " Success Create Profile",
//           data: {
//             ...response.row[0],
//             first_name: body.first_name,
//             last_name: body.last_name,
//             address: body.address,
//           },
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({ msg: "Internal Server Error", error: err.message });
//       });
//   },
//   get: async (req, res) => {
//     console.log(req.userPayload);
//     try {
//       const response = await usersRepo.getUsers();
//       res.status(201).json({
//         result: response.rows,
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error", error: err.message });
//     }
//   },
//   getById: async (req, res) => {
//     try {
//       const response = await usersRepo.getUsersByID(id);
//       res.status(201).json({
//         result: response.rows,
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error", error: err.message });
//     }
//   },
// };

// const { response } = require("express");
// const usersRepo = require("../repo/R_users");

// module.exports = {
//
//   create: async (req, res) => {
//     const { body } = req;
//     try {
//       const response = await usersRepo.register(req.body);
//       res.status(201).json({
//         msg: "Register Success",
//         data: {
//           ...response.rows[0],
//           email: body.email,
//           name: body.name,
//           phone_number: body.phone_number,
//           role: body.role,
//         },
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
//   edit: async (req, res) => {
//     try {
//       const response = await usersRepo.editAccount(req.body, req.params);
//       res.status(200).json({ msg: " Edit data success", result: response });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
//   drop: async (req, res) => {
//     try {
//       const response = await usersRepo.deleteAccount(req.params);
//       res.status(200).json({
//         msg: "Delete data success",
//         result: response,
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },

//   password: async (req, res) => {
//     const { body } = req;
//     usersRepo
//       .editPassword(body)
//       .then((response) => {
//         res.status(500).json({
//           msg: "Password has been changed",
//           data: null,
//         });
//       })
//       .catch(() => {
//         return res.status(500).json({ msg: "Internal Server Erorr" });
//       });
//   },
// };

// // const { response } = require("express");
// const usersRepo = require("../repo/R_users");
// module.exports = {
//   get: async (req, res) => {
//     try {
//       const response = await usersRepo.getAccount(req.query);
//       res.status(201).json({
//         result: response.rows,
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error", error: err.message });
//     }
//   },
//   create: async (req, res) => {
//     const { body } = req;
//     try {
//       const response = await usersRepo.register(req.body);
//       res.status(201).json({
//         msg: "Register Success",
//         data: {
//           ...response.rows[0],
//           email: body.email,
//           name: body.name,
//           phone_number: body.phone_number,
//           role: body.role,
//         },
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
//   edit: async (req, res) => {
//     try {
//       const response = await usersRepo.editAccount(req.body, req.params);
//       res.status(200).json({ msg: " Edit data success", result: response });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },
//   drop: async (req, res) => {
//     try {
//       const response = await usersRepo.deleteAccount(req.params);
//       res.status(200).json({
//         msg: "Delete data success",
//         result: response,
//       });
//     } catch (err) {
//       res.status(500).json({ msg: "Internal Server Error" });
//     }
//   },

//   password: async (req, res) => {
//     const { body } = req;
//     usersRepo
//       .editPassword(body)
//       .then((response) => {
//         res.status(500).json({
//           msg: "Password has been changed",
//         });
//       })
//       .catch((objErr) => {
//         const statusCode = objErr.statusCode || 500;
//         res.status(statusCode).json({ msg: objErr.err.message });
//       });
//   },
// };
// const { getUser, getSingleUserFromServer, createNewUser, deleteUser, updateUser } = require("../repo/R_users");
// const { successResponse, errorResponse } = require("../helpers/response");

// module.exports = {
//   getAllusers: (req, res) => {
//     getUser(req.query)
//       .then((result) => {
//         const { totalData, totalPage, data } = result;
//         const meta = {
//           totalData,
//           totalPage,
//           route: `/user${req.route.path}?)`,
//           query: req.query,
//           page: Number(req.query.page),
//         };
//         successResponse(res, 200, data, meta);
//       })
//       .catch((error) => {
//         const { err, status } = error;
//         errorResponse(res, status, err);
//       });
//   },
//   getUserById: (req, res) => {
//     const id = req.params.id;
//     getSingleUserFromServer(id)
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
//   postNewUser: (req, res) => {
//     createNewUser(req.body)
//       .then(({ data }) => {
//         res.status(200).json({
//           err: null,
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
//   deleteUserById: (req, res) => {
//     const id = req.params.id;
//     deleteUser(id)
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
//   updateUserById: (req, res) => {
//     const { file } = req;
//     let picture;
//     if (file) {
//       picture = file.path.replace("public", "").replace(/\\/g, "/");
//     }
//     const id = req.params.id;
//     updateUser(id, req.body, picture)
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
