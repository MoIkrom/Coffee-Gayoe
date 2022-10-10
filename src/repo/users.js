const postgreDb = require("../config/postgre");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query = "select name, gender, email, phone from users";
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
    const query = "insert into users ( name, gender, email, password, phone, address) values ($1,$2,$3,$4,$5,$6)";

    const { name, gender, email, password, phone, address } = body;
    postgreDb.query(query, [name, gender, email, password, phone, address], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve("CREATE DATA SUCCESS");
    });
  });
};
const editUsers = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update users set ";
    const values = [];

    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where users_id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });

    postgreDb
      .query(query, values)
      .then((response) => {
        resolve("UPDATE DATA SUCCESS");
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const deleteUsers = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from users where users_id = $1";

    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve("DELETE DATA SUCCESS");
    });
  });
};

module.exports = {
  getUsers,
  createUsers,
  editUsers,
  deleteUsers,
};
