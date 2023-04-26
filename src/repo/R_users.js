const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");

module.exports = {
  getUsers: () => {
    return new Promise((resolve, reject) => {
      const query = "select * from users";
      postgreDb.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },
  createUsers: (body) => {
    return new Promise((resolve, reject) => {
      const query = "insert into users ( email, password, username) values ($1,$2,$3) returning id,email";
      const { email, password, username } = body;
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        postgreDb.query(query, [email, hashedPassword, username], (err, queryResult) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          resolve(queryResult);
        });
      });
    });
  },
  createOTP: (OTP, id) => {
    return new Promise((resolve, reject) => {
      const query = `update users set otp = ${OTP} where id = ${id}`;

      postgreDb.query(query, (err, queryResult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
      });
    });
  },
  getOTP: (id) => {
    return new Promise((resolve, reject) => {
      const query = `select otp from users where id = ${id}`;

      postgreDb.query(query, (err, queryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(queryResult.rows[0].otp);
      });
    });
  },
  deleteOTP: (id) => {
    return new Promise((resolve, reject) => {
      const query = `update users set otp = '' where id = ${id}`;

      postgreDb.query(query, (err, queryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(queryResult);
      });
    });
  },
  AccountVerified: (id) => {
    return new Promise((resolve, reject) => {
      const query = `update users set status = 'activated' where id = ${id}`;

      postgreDb.query(query, (err, queryResult) => {
        if (err) {
          return reject(err);
        }
        resolve(queryResult);
      });
    });
  },

  // edit profil Acil

  profile: (body, token) => {
    return new Promise((resolve, reject) => {
      let query = "update users set ";
      const values = [];
      Object.keys(body).forEach((key, idx, array) => {
        if (idx === array.length - 1) {
          query += `${key} = $${idx + 1} where id = $${idx + 2} returning id, firstname, lastname,username,addres,image`;
          values.push(body[key], token);
          return;
        }
        query += `${key} = $${idx + 1},`;
        values.push(body[key]);
      });
      postgreDb
        .query(query, values)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },

  editUsers: (body, token, file) => {
    return new Promise((resolve, reject) => {
      const { firstname, lastname, gender, addres, username } = body;
      let query = "update users set ";
      const values = [];
      let imageProfile = "";
      let data = {
        id: token,
      };
      if (file) {
        const imageUrl = `${file.secure_url} `;
        if (!firstname && !lastname && !username && !gender && !addres) {
          if (file && file.resource_type == "image") {
            query += `image = '${imageUrl}' where id = $1`;
            values.push(token);
          }
        } else {
          if (file && file.resource_type == "image") {
            query += `image = '${imageUrl}',`;
          }
        }
      }

      Object.keys(body).forEach((key, idx, array) => {
        if (idx === array.length - 1) {
          query += `${key} = $${idx + 1} where id = $${idx + 2} returning id, firstname, lastname, username, gender, addres, image`;
          values.push(body[key], token);
          return;
        }
        query += `${key} = $${idx + 1},`;
        values.push(body[key]);
      });
      postgreDb.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        console.log(values);
        console.log(query);
        resolve(result);
      });
    });
  },
  editPassword: (body, token) => {
    return new Promise((resolve, reject) => {
      const { old_password, new_password } = body;
      const getPwdQuery = "select password from users where id = $1";
      const getPwdValues = [token];
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
              err: new Error("Old Password is Wrong!"),
              statusCode: 403,
            });
          bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
            if (err) {
              console.log(err);
              return reject({ err });
            }
            const editPwdQuery = "update users set password = $1 where id = $2";
            const editPwdValues = [newHashedPassword, token];
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
  deleteUsers: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from users where id = $1";
      // OR => logika atau sql
      // "OR" => string OR
      postgreDb.query(query, [params.id], (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  getUsersById: (token) => {
    // console.log(token);
    return new Promise((resolve, reject) => {
      const query = "select id, email, phone_number, firstname, lastname, username, gender, addres, image, role, created_at from users where id =$1";
      // const payload = req.userPayload;
      // console.log(token);
      postgreDb.query(query, [token], (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = "select email from users where email =$1";
      postgreDb.query(query, [email], (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },
};
