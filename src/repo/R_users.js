const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");
// const { register } = require("./R_authentication");

module.exports = {
  register: (body) => {
    return new Promise((resolve, reject) => {
      const { display_name, email, password, phone_number } = body;

      //hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const query = "insert into accounts ( display_name, email, password, phone_number) values ($1,$2,$3,$4) returning id";
        const values = [display_name, email, hashedPassword, phone_number];
        postgreDb.query(query, values, (err, result) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          return resolve(result);
        });
      });
    });
  },
  editPassword: (body) => {
    return new Promise((resolve, reject) => {
      const { old_password, new_password, user_id } = body;
      const getPwdQuery = "SELECT password FROM accounts WHERE id = $1";
      const getPwdValues = [user_id];
      postgreDb.query(getPwdQuery, getPwdValues, (err, response) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        const hashedPassword = response.rows[0].password;
        bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          if (!isSame)
            return reject({
              err: new Error("Old Password is wrong"),
              statusCode: 403,
            });
          bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
            if (err) {
              console.log(err);
              return reject({ err });
            }
            const editPwdQuery = "UPDATE accounts SET password = $1 WHERE id = $2";
            const editPwdValues = [newHashedPassword, user_id];
            postgreDb.query(editPwdQuery, editPwdValues, (err, response) => {
              if (err) {
                console.log(err);
                return reject({ err });
              }
              return resolve(response);
            });
          });
        });
      });
    });
  },
  createProfile: (body, token) => {
    return new Promise((resolve, reject) => {
      const { first_name, last_name, address } = body;

      const user_id = token.user_id;

      const query = "INSERT INTO profiles (account_id , first_name, last_name, address) VALUES ($1, $2, $3, $4)";
      postgreDb
        .query(query, [user_id, first_name, last_name, address])
        .then(({ rows }) => {
          const response = {
            data: rows[0],
          };
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          reject({ status: 500, err });
        });
    });
  },
};

//   getAccount: (queryparams) => {
//     return new Promise((resolve, reject) => {
//       let query = "select id ,name, email, phone_number, role,created_at from accounts";
//       if (queryparams.search) {
//         query += ` where lower(name) like lower('%${queryparams.search}%')`;
//       }
//       postgreDb.query(query, (err, result) => {
//         if (err) {
//           console.log(err);
//           return reject(err);
//         }
//         return resolve(result);
//       });
//     });
//   },

// //   // check Email
// //   check_email: (email) => {
// //     return new Promise((resolve, reject) => {
// //       const sqlQuery = "SELECT email FROM accounts WHERE email = $1";
// //       postgreDb
// //         .query(sqlQuery, [email])
// //         .then((result) => {
// //           resolve(result);
// //         })
// //         .catch((err) => {
// //           reject(err);
// //         });
// //     });
// //   },

// //   editAccount: (body, params) => {
// //     return new Promise((resolve, reject) => {
// //       let query = "update accounts set ";
// //       const values = [];

// //       Object.keys(body).forEach((key, idx, array) => {
// //         if (idx === array.length - 1) {
// //           query += `${key} = $${idx + 1} where id = $${idx + 2}`;
// //           values.push(body[key], params.id);
// //           return;
// //         }
// //         query += `${key} = $${idx + 1},`;
// //         values.push(body[key]);
// //       });
// //       postgreDb
// //         .query(query, values)
// //         .then(() => {
// //           resolve(body);
// //         })
// //         .catch((err) => {
// //           console.log(err);
// //           reject(err);
// //         });
// //     });
// //   },
// //   deleteAccount: (params) => {
// //     return new Promise((resolve, reject) => {
// //       const query = "delete from accounts where id = $1";

// //       postgreDb.query(query, [params.id], (err, result) => {
// //         if (err) {
// //           console.log(err);
// //           return reject(err);
// //         }
// //         resolve(params);
// //       });
// //     });
// //   },
// //   editPassword: (body) => {
// //     return new Promise((resolve, reject) => {
// //       const { old_password, new_password, user_id } = body;
// //       const getPwdQuery = "SELECT password FROM users WHERE id = $1";
// //       const getPwdValues = [user_id];
// //       db.query(getPwdQuery, getPwdValues, (err, response) => {
// //         if (err) {
// //           console.log(err);
// //           return reject({ err });
// //         }
// //         const hashedPassword = response.rows[0].password;
// //         bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
// //           if (err) {
// //             console.log(err);
// //             return reject({ err });
// //           }
// //           if (!isSame)
// //             return reject({
// //               err: new Error("Old Password is wrong"),
// //               statusCode: 403,
// //             });
// //           bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
// //             if (err) {
// //               console.log(err);
// //               return reject({ err });
// //             }
// //             const editPwdQuery = "UPDATE users SET password = $1 WHERE id = $2";
// //             const editPwdValues = [newHashedPassword, user_id];
// //             db.query(editPwdQuery, editPwdValues, (err, response) => {
// //               if (err) {
// //                 console.log(err);
// //                 return reject({ err });
// //               }
// //               return resolve(response);
// //             });
// //           });
// //         });
// //       });
// //     });
// //   },
// // };

// // ============================================================

// // const postgreDb = require("../config/postgre");

// // module.exports = {
// //   getAccount: (query) => {
// //     return new Promise((resolve, reject) => {
// //       const { page = 1, limit = 3 } = query;
// //       const offset = Number(page - 1) * Number(limit);

// //       postgreDb
// //         .query("SELECT * FROM accounts ORDER BY id LIMIT $1 OFFSET $2", [Number(limit), offset])
// //         .then((result) => {
// //           const response = {
// //             data: result.rows,
// //           };
// //           postgreDb
// //             .query("SELECT COUNT(*) AS total_account FROM accounts")
// //             .then((result) => {
// //               response.totalData = Number(result.rows[0]["total_account"]);
// //               response.totalPage = Math.ceil(response.totalData / Number(limit));
// //               resolve(response);
// //             })
// //             .catch((err) => {
// //               reject({ status: 500, err });
// //             });
// //         })
// //         .catch((err) => {
// //           reject({ status: 500, err });
// //         });
// //     });
// //   },
// //   getSingleUserFromServer: (id) => {
// //     return new Promise((resolve, reject) => {
// //       const query = "select * from accounts where id = $1";
// //       postgreDb
// //         .query(query, [id])
// //         .then((data) => {
// //           if (data.rows.length === 0) {
// //             return reject({ status: 404, err: "User Not Found" });
// //           }
// //           const response = {
// //             data: data.rows,
// //           };
// //           resolve(response);
// //         })
// //         .catch((err) => {
// //           reject({ status: 500, err });
// //         });
// //     });
// //   },

// //   deleteAccount: (id) => {
// //     return new Promise((resolve, reject) => {
// //       const query = "DELETE FROM accounts where accounts.id = $1";
// //       postgreDb
// //         .query(query, [id])
// //         .then((data) => {
// //           const response = {
// //             data,
// //           };
// //           resolve(response);
// //         })
// //         .catch((err) => {
// //           reject({ status: 500, err });
// //         });
// //     });
// //   },
// //   updateAccount: (id, body, picture) => {
// //     return new Promise((resolve, reject) => {
// //       const { display_name, email, phone_number, address } = body;
// //       const query = "UPDATE accounts SET display_name = $1, email = $2, phone_number = $3, address = $4, picture = $5 WHERE accounts.id = $6";
// //       postgreDb
// //         .query(query, [display_name, email, phone_number, address, picture, id])
// //         .then((data) => {
// //           const response = {
// //             data,
// //           };
// //           resolve(response);
// //         })
// //         .catch((err) => {
// //           reject({ status: 500, err });
// //         });
// //     });
// //   },
// // };
