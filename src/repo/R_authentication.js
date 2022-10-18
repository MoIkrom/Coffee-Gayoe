const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const postgreDb = require("../config/postgre");
module.exports = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const { email, password } = body;
      console.log(password);
      // 1. cek email di DB
      const getPasswordByEmailQuery = "SELECT id, display_name, password FROM accounts WHERE email = $1";
      const getPasswordByEmailValues = [email];
      postgreDb.query(getPasswordByEmailQuery, getPasswordByEmailValues, (err, response) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        if (response.rows.length === 0) {
          console.log(response);
          return reject({
            err: new Error("Email/Password is Wrong yet"),
            statusCode: 401,
          });
        }
        // 2. identifikasi password
        const hashedPassword = response.rows[0].password;
        bcrypt.compare(password, hashedPassword, (err, isSame) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          if (!isSame)
            return reject({
              err: new Error("Email/Password is Wrong"),
              statusCode: 401,
            });

          // 3. proses login => create jwt => return jwt to user
          const payload = {
            user_id: response.rows[0].id,
            display_name: response.rows[0].display_name,
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
              return resolve({ token, display_name: payload.display_name });
            }
          );
        });
      });
    });
  },
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT email FROM accounts WHERE email = $1";
      postgreDb
        .query(query, [email])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

// ==========================================

// const postgreDb = require("../config/postgre");
// // const { v4: uuidV4 } = require("uuid");

// module.exports = {
//   register: (email, phone_number, hashedPassword) => {
//     return new Promise((resolve, reject) => {
//       const query = "INSERT INTO accounts (id, email, phone_number, password, role,  created_at) VALUES ($1, $2, $3, $4, $5)";
//       // const id = uuidV4();
//       const timestamp = new Date(Date.now());
//       const values = [id, email, phone_number, hashedPassword, timestamp];
//       postgreDb
//         .query(query, values)
//         .then(() => {
//           resolve();
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },
//
//   getPassByUserEmail: async (email) => {
//     try {
//       const query = "SELECT id, password FROM accounts WHERE email = $1";
//       const result = await postgreDb.query(query, [email]);
//       if (result.rowCount === 0) throw { status: 400, err: { msg: "Email Is Not Registered" } };
//       return result.rows[0];
//     } catch (error) {
//       const { status = 500, err } = error;
//       throw { status, err };
//     }
//   },
// };
