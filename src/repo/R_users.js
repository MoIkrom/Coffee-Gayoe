const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");
// const { register } = require("./R_authentication");

module.exports = {
  getAccount: (queryparams) => {
    return new Promise((resolve, reject) => {
      let query = "select id ,name, email, phone_number, role,created_at from accounts";
      if (queryparams.search) {
        query += ` where lower(name) like lower('%${queryparams.search}%')`;
      }
      postgreDb.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  // check Email
  check_email: (email) => {
    return new Promise((resolve, reject) => {
      const sqlQuery = "SELECT email FROM accounts WHERE email = $1";
      postgreDb
        .query(sqlQuery, [email])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  register: (body) => {
    return new Promise((resolve, reject) => {
      const query = "insert into accounts ( display_name, email, password, phone_number, role,created_at) values ($1,$2,$3,$4,$5,$6) returning id";
      const { display_name, email, password, phone_number, role, created_at } = body;

      //hash password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const values = [display_name, email, hashedPassword, phone_number, role, created_at];
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

  editAccount: (body, params) => {
    return new Promise((resolve, reject) => {
      let query = "update accounts set ";
      const values = [];

      Object.keys(body).forEach((key, idx, array) => {
        if (idx === array.length - 1) {
          query += `${key} = $${idx + 1} where id = $${idx + 2}`;
          values.push(body[key], params.id);
          return;
        }
        query += `${key} = $${idx + 1},`;
        values.push(body[key]);
      });
      postgreDb
        .query(query, values)
        .then(() => {
          resolve(body);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  deleteAccount: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from accounts where id = $1";

      postgreDb.query(query, [params.id], (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(params);
      });
    });
  },
  editPassword: (body) => {
    return new Promise((resolve, reject) => {
      const { old_password, new_password, user_id } = body;
      const getPwdQuery = "SELECT password FROM users WHERE id = $1";
      const getPwdValues = [user_id];
      db.query(getPwdQuery, getPwdValues, (err, response) => {
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
            const editPwdQuery = "UPDATE users SET password = $1 WHERE id = $2";
            const editPwdValues = [newHashedPassword, user_id];
            db.query(editPwdQuery, editPwdValues, (err, response) => {
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
};
