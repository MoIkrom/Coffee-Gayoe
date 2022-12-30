const postgreDb = require("../config/postgre");
const bcrypt = require("bcrypt");
const getUsers = () => {
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
};
const createUsers = (body) => {
  return new Promise((resolve, reject) => {
    const query = "insert into users ( email, password, phone_number) values ($1,$2,$3) returning id,email";
    const { email, password, phone_number } = body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      postgreDb.query(query, [email, hashedPassword, phone_number], (err, queryResult) => {
        console.log(query);
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
      });
    });
  });
};
const editUsers = (body, token, file) => {
  // console.log(token);
  return new Promise((resolve, reject) => {
    const { firstname, lastname, username, gender, addres, display_name, image } = body;
    let query = "update users set ";
    const values = [];
    let imageProfile = "";
    let data = {
      id: token,
    };
    if (file) {
      imageProfile = file.url;
      // if (!firstname && !lastname && !username && !gender && !addres && !display_name && !image) {
      if (!firstname && !lastname && !addres && !display_name && !image) {
        if (file && file.resource_type == "image") {
          query += `image = '${imageProfile}',updated_at = now() where id = $1`;
          values.push(token);
          data["image"] = imageProfile;
        }
      } else {
        if (file && file.resource_type == "image") {
          query += `image = '${imageProfile}',`;
          data["image"] = imageProfile;
        }
      }
    }

    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2} returning id, firstname, lastname, display_name, gender, addres, image`;
        values.push(body[key], token);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
      // console.log(values);
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
};
const editPassword = (body, token) => {
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
};
const deleteUsers = (params) => {
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
};
const getUsersById = (token) => {
  // console.log(token);
  return new Promise((resolve, reject) => {
    const query = "select id, email, phone_number, display_name, firstname, lastname, username, gender, addres, image, role, created_at from users where id =$1";
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
};

const repousers = {
  getUsers,
  createUsers,
  editPassword,
  editUsers,
  deleteUsers,
  getUsersById,
};

module.exports = repousers;

// ==============================================================================

// const postgreDb = require("../config/postgre");
// const bcrypt = require("bcrypt");

// module.exports = {
//   register: (body) => {
//     return new Promise((resolve, reject) => {
//       const { display_name, email, password, phone_number, role } = body;

//       //hash password
//       bcrypt.hash(password, 10, (err, hashedPassword) => {
//         if (err) {
//           console.log(err);
//           return reject(err);
//         }
//         const query = "insert into accounts ( display_name, email, password, phone_number , role) values ($1,$2,$3,$4, $5) returning id";
//         const values = [display_name, email, hashedPassword, phone_number, role];
//         postgreDb.query(query, values, (err, response) => {
//           if (err) {
//             console.log(err);
//             return reject(err);
//           }

//           return resolve(response);
//         });
//       });
//     });
//   },
//   getUsers: () => {
//     return new Promise((resolve, reject) => {
//       const query = "select * from profiles ";

//       postgreDb.query(query, (error, result) => {
//         if (error) return reject(error);
//         return resolve(result);
//       });
//     });
//   },
//   getUsersById: (token) => {
//     return new Promise((resolve, reject) => {
//       const query = "select * from profiles where id =$1";
// const payload = req.userPayload;
//       postgreDb.query(query, [token], (error, result) => {
//         if (data.rows.length === 0) return reject(error, { status: 404, err: "User Not Found" });
//         const response = {
//           data: data.rows,
//         };
//         return resolve(response);
//       });
//     });
//   },
//   editPassword: (body, token) => {
//     return new Promise((resolve, reject) => {
//       const { old_password, new_password } = body;
//       const getPwdQuery = "SELECT password FROM accounts WHERE id = $1";
//       const getPwdValues = [token];
//       postgreDb.query(getPwdQuery, getPwdValues, (err, response) => {
//         if (err) {
//           console.log(err);
//           return reject({ err });
//         }
//         const hashedPassword = response.rows[0].password;
//         bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
//           if (err) {
//             console.log(err);
//             return reject({ err });
//           }
//           if (!isSame)
//             return reject({
//               err: new Error("Old Password is wrong"),
//               statusCode: 403,
//             });
//           bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
//             if (err) {
//               console.log(err);
//               return reject({ err });
//             }
//             const editPwdQuery = "UPDATE accounts SET password = $1 WHERE id = $2";
//             const editPwdValues = [newHashedPassword, token];
//             postgreDb.query(editPwdQuery, editPwdValues, (err, response) => {
//               if (err) {
//                 console.log(err);
//                 return reject({ err });
//               }
//               return resolve(response);
//             });
//           });
//         });
//       });
//     });
//   },

//   createProfile: (body, userPayload) => {
//     return new Promise((resolve, reject) => {
//       const { firstname, lastname, address } = body;
//       console.log(userPayload);
//       const userId = userPayload.user_id;

//       const query = "INSERT INTO profiles (user_id, firstname, lastname, adress) VALUES ($1,$2,$3,$4)";
//       postgreDb.query(query, [userId, firstname, lastname, address], (err, response) => {
//         if (err) {
//           console.log(err);
//           reject({ status: 500, err });
//         }
//         const sendResponse = {
//           firstname: body.firstname,
//           lastname: body.lastname,
//           address: body.address,
//         };
//         resolve(created(sendResponse));
//       });
//     });
//   },
// };

// const getDetailUserModel = (id) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT display_name, address, phone, image_profile, birthdate, gender, first_name, last_name, email FROM public.users WHERE id = $1";
//     db.query(sql, [Number(id)], (err, res) => {
//       if (err)
//         return reject({
//           message: "Data not found",
//           status: 500,
//           err,
//         });
//       if (res.length === 0)
//         return reject({
//           message: "Data not found",
//           status: 404,
//           err,
//         });
//       return resolve({
//         message: "Data found",
//         status: 200,
//         data: res.rows[0],
//       });
//     });
//   });
// };
