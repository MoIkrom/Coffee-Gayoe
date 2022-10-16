const postgreDb = require("../config/postgre");

const getTransaction = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select t.transaction_id ,  u.name , p.product_name , p.priceproduct , pr.cuponcode , u.address from transactions t left join users u on u.id = t.user_id left join products p on p.id  = t.product_id left join promos pr on p.promo_id  = pr.id  ";
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
    const query = "insert into transactions ( user_id , product_id, sub_total , payment) values ($1,$2,$3,$4)";
    const { user_id, product_id, sub_total, payment } = body;

    postgreDb.query(query, [user_id, product_id, sub_total, payment], (err, queryResult) => {
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
      .then(() => {
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
