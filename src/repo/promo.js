const postgreDb = require("../config/postgre");

const getPromo = () => {
  return new Promise((resolve, reject) => {
    const query = "select cuponcode, product_name, discount_product , discount_price from promos";
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
    const query = "insert into promos ( cuponcode, product_name, discount_product , discount_price) values ($1,$2,$3,$4)";
    const { cuponcode, product_name, discount_product, discount_price } = body;
    postgreDb.query(query, [cuponcode, product_name, discount_product, discount_price], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve("CREATE DATA SUCCESS");
    });
  });
};
const editPromo = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set ";
    const values = [];

    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where promo_id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });

    postgreDb
      .query(query, values)
      .then((response) => {
        resolve("EDIT DATA SUCCESS");
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const deletePromo = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from promos where promo_id = $1";

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
  getPromo,
  createPromo,
  editPromo,
  deletePromo,
};
