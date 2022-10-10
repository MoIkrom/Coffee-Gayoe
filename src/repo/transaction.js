const postgreDb = require("../config/postgre");

const getTransaction = () => {
  return new Promise((resolve, reject) => {
    const query = "select transaction_id,name_product,category_product,price_product,size_product,payment from transactions";
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
    const query = "insert into transactions ( name_product, category_product, price_product, address , size_product, payment, buyer) values ($1,$2,$3,$4,$5,$6,$7)";
    // for loop query += ",($5,$6,$7,$8)";
    const { name_product, category_product, price_product, address, size_product, payment, buyer } = body;
    postgreDb.query(query, [name_product, category_product, price_product, address, size_product, payment, buyer], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve("CREATE DATA SUCCESS");
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
        resolve("EDIT DATA SUCCESS");
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
      resolve("DELETE DATA SUCCESS");
    });
  });
};

module.exports = {
  getTransaction,
  createTransaction,
  editTransaction,
  deleteTransaction,
};
