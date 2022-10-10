const postgreDb = require("../config/postgre");

const getProduct = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from products";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
const createProduct = (body) => {
  return new Promise((resolve, reject) => {
    const query = "insert into products ( product_name, priceproduct, categoryproduct, stock) values ($1,$2,$3,$4)";
    // for loop query += ",($5,$6,$7,$8)";
    const { product_name, priceproduct, categoryproduct, stock } = body;
    postgreDb.query(query, [product_name, priceproduct, categoryproduct, stock], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
    });
  });
};
const editProduct = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
    const values = [];

    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where products_id = $${idx + 2}`;
        values.push(body[key], params.id);
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
};
const deleteProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from products where products_id = $1";

    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const productRepo = {
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
};

module.exports = productRepo;
