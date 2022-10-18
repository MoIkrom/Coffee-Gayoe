const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");

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
        postgreDb.query(query, values, (err, response) => {
          if (err) {
            console.log(err);
            return reject(err);
          }

          return resolve(response);
        });
      });
    });
  },
  getUsers: () => {
    return new Promise((resolve, reject) => {
      const query = "select * from profiles ";

      postgreDb.query(query, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
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

  createProfile: (body, userPayload) => {
    return new Promise((resolve, reject) => {
      const { firstname, lastname, address } = body;
      console.log(userPayload);
      const userId = userPayload.user_id;

      const query = "INSERT INTO profiles (user_id, firstname, lastname, adress) VALUES ($1,$2,$3,$4)";
      postgreDb.query(query, [userId, firstname, lastname, address], (err, response) => {
        if (err) {
          console.log(err);
          reject({ status: 500, err });
        }
        const sendResponse = {
          firstname: body.firstname,
          lastname: body.lastname,
          address: body.address,
        };
        resolve(created(sendResponse));
      });
    });
  },
};
