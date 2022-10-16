// const db = require("../config/db");

// module.exports = {
//   getProfile: (query) => {
//     return new Promise((resolve, reject) => {
//       const { page = 1, limit = 3 } = query;
//       const offset = Number(page - 1) * Number(limit);

//       db.query("SELECT * FROM public.profile ORDER BY id LIMIT $1 OFFSET $2", [Number(limit), offset])
//         .then((result) => {
//           const response = {
//             data: result.rows,
//           };
//           db.query("SELECT COUNT(*) AS total_user FROM public.profile")
//             .then((result) => {
//               response.totalData = Number(result.rows[0]["total_user"]);
//               response.totalPage = Math.ceil(response.totalData / Number(limit));
//               resolve(response);
//             })
//             .catch((err) => {
//               reject({ status: 500, err });
//             });
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   getSingleUserFromServer: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "select * from public.peofile where id = $1";
//       db.query(query, [id])
//         .then((data) => {
//           if (data.rows.length === 0) {
//             return reject({ status: 404, err: "User Not Found" });
//           }
//           const response = {
//             data: data.rows,
//           };
//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   createNewUser: (body) => {
//     return new Promise((resolve, reject) => {
//       const { name, email, phone_number } = body;
//       const query = "INSERT INTO public.accounts(name, email, phone_number) VALUES ($1, $2, $3,) RETURNING *";
//       db.query(query, [name, email, phone_number])
//         .then(({ rows }) => {
//           const response = {
//             data: rows[0],
//           };
//           resolve(response);
//         })
//         .catch((err) => reject({ status: 500, err }));
//     });
//   },

//   deleteUser: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "DELETE FROM public.accounts where public.accounts.id = $1";
//       db.query(query, [id])
//         .then((data) => {
//           const response = {
//             data,
//           };

//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   updateUser: (id, body, picture) => {
//     return new Promise((resolve, reject) => {
//       const { display_name, email, phone_number, address } = body;
//       const sqlQuery = "UPDATE public.users SET display_name = $1, email = $2, phone_number = $3, address = $4, picture = $5 WHERE public.users.id = $6";
//       db.query(sqlQuery, [display_name, email, phone_number, address, picture, id])
//         .then((data) => {
//           const response = {
//             data,
//           };

//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },
// };
