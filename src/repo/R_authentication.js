const bcrypt = require("bcrypt");
const db = require("../config/postgre");
const jwt = require("jsonwebtoken");
module.exports = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, password } = body;
      const getPasswordByEmailQuery = "SELECT id, email, password, role FROM users WHERE email = $1";
      const getPasswordByEmailValues = [email];
      db.query(getPasswordByEmailQuery, getPasswordByEmailValues, (err, response) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        if (response.rows.length === 0) return reject({ err: new Error("Email/Password is Wrong"), statusCode: 401 });
        const hashedPassword = response.rows[0].password;
        bcrypt.compare(password, hashedPassword, (err, isSame) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          if (!isSame)
            return reject({
              err: new Error("Email/Password is Wrong!"),
              statusCode: 401,
            });

          const payload = {
            user_id: response.rows[0].id,
            name: response.rows[0].name,
            role: response.rows[0].role,
            email,
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              expiresIn: "5m",
              issuer: process.env.ISSUER,
            },
            (err, token) => {
              if (err) {
                console.log(err);
                return reject({ err });
              }
              return resolve({ token, email, role: payload.role, name: payload.name });
            }
          );
        });
      });
    });
  },
};

// ===================================================================

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const postgreDb = require("../config/postgre");
// module.exports = {
//   login: (body) => {
//     return new Promise((resolve, reject) => {
//       const { email, password } = body;
//       console.log(password);
//       // 1. cek email di DB
//       const getPasswordByEmailQuery = "SELECT id, display_name, password , role FROM accounts WHERE email = $1";
//       const getPasswordByEmailValues = [email];
//       postgreDb.query(getPasswordByEmailQuery, getPasswordByEmailValues, (err, response) => {
//         if (err) {
//           console.log(err);
//           return reject({ err });
//         }
//         if (response.rows.length === 0) {
//           console.log(response);
//           return reject({
//             err: new Error("Email/Password is Wrong "),
//             statusCode: 401,
//           });
//         }
//         // 2. identifikasi password
//         const hashedPassword = response.rows[0].password;
//         bcrypt.compare(password, hashedPassword, (err, isSame) => {
//           if (err) {
//             console.log(err);
//             return reject({ err });
//           }
//           if (!isSame)
//             return reject({
//               err: new Error("Email/Password is Wrong"),
//               statusCode: 401,
//             });

//           // 3. proses login => create jwt => return jwt to user
//           const payload = {
//             user_id: response.rows[0].id,
//             display_name: response.rows[0].display_name,
//             email,
//             role: response.rows[0].role,
//           };
//           jwt.sign(
//             payload,
//             process.env.SECRET_KEY,
//             {
//               expiresIn: "5m",
//               issuer: process.env.ISSUER,
//             },
//             (err, token) => {
//               if (err) {
//                 console.log(err);
//                 return reject({ err });
//               }
//               return resolve({ token, display_name: payload.display_name });
//             }
//           );
//         });
//       });
//     });
//   },
//   getUserByEmail: (email) => {
//     return new Promise((resolve, reject) => {
//       const query = "SELECT email FROM accounts WHERE email = $1";
//       postgreDb
//         .query(query, [email])
//         .then((result) => {
//           resolve(result);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
//   getUserByPhoneNumber: (phone_number) => {
//     return new Promise((resolve, reject) => {
//       const query = "SELECT phone_number FROM accounts WHERE phone_number = $1";
//       postgreDb
//         .query(query, [phone_number])
//         .then((result) => {
//           resolve(result);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
// };
