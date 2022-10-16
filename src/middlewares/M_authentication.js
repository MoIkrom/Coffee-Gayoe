// const checkDuplicate = (req, res, next) => {
//   getUserByEmail(req.body.email)
//     .then((result) => {
//       if (result.rowCount > 0) return errorResponse(res, 400, { msg: "Email is Already Used" });
//       next();
//     })
//     .catch((error) => {
//       const { status, err } = error;
//       errorResponse(res, status, err);
//     });
// };

// module.export = {
//   checkDuplicate,
// }
