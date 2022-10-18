const postgreDb = require("../config/postgre");

const getPromo = (queryparams) => {
  return new Promise((resolve, reject) => {
    let query = "select id , code, discount , created_at , product_id from promos";
    if (queryparams.order == "discount") {
      query += ` order by discount desc `;
    }

    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
const createPromo = (body) => {
  return new Promise((resolve, reject) => {
    const query = "insert into promos (code, discount, product_id) values ($1,$2,$3) ";
    const { code, discount, product_id } = body;
    postgreDb
      .query(query, [code, discount, product_id])
      .then(() => {
        resolve("Create Data Success");
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const editPromo = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set ";
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
      .then((response) => {
        resolve("EDIT DATA SUCCESS : " + values);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const deletePromo = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from promos where id = $1";

    postgreDb
      .query(query, [params.id])
      .then(() => {
        resolve("DELETE DATA SUCCESS");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  getPromo,
  createPromo,
  editPromo,
  deletePromo,
};
