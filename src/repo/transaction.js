const postgreDb = require("../config/postgre");

const getTransaction = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from transactions";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
const createTransaction = (body) => {
  return new Promise((resolve, reject) => {
    const query = "insert into transactions ( name_product, category_product, price_product, address , size_product) values ($1,$2,$3,$4,$5)";
    // for loop query += ",($5,$6,$7,$8)";
    const { name_product, category_product, price_product, address, size_product } = body;
    postgreDb.query(query, [name_product, category_product, price_product, address, size_product], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
    });
  });
};
const editTransaction = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transactions set ";
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where transaction_id = $${idx + 2}`;
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
const deleteTransaction = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transactions where transaction_id = $1";

    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const transactionRepo = {
  getTransaction,
  createTransaction,
  editTransaction,
  deleteTransaction,
};

module.exports = transactionRepo;
