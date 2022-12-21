const postgreDb = require("../config/postgre");

const getTransactions = () => {
  return new Promise((resolve, reject) => {
    const query =
      "select products.product_name, products.price, products.size, products.category, promos.code, promos.discount, users.display_name, users.addres, transactions.qty, transactions.shiping, transactions.tax, transactions.total, transactions.payment, transactions.status from transactions join products on transactions.product_id = products.id join promos on transactions.promo_id = promos.id join users on transactions.user_id = users.id";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const historyTransactions = (queryparams, token) => {
  return new Promise((resolve, reject) => {
    let query =
      "select transactions.id, users.email, products.product_name, products.image, transactions.qty, transactions.tax, transactions.payment, transactions.total, transactions.status , transactions.created_at from transactions inner join users on users.id = transactions.user_id inner join products on products.id = transactions.product_id where users.id = $1 order by transactions.created_at desc";

    let queryLimit = "";
    let link = `https://coffee-gayoe.vercel.app/api/v1/transactions/history?`;

    let values = [token];
    if (queryparams.page && queryparams.limit) {
      let page = parseInt(queryparams.page);
      let limit = parseInt(queryparams.limit);
      let offset = (page - 1) * limit;
      queryLimit = query + ` limit $2 offset $3`;
      values.push(limit, offset);
    } else {
      queryLimit = query;
    }

    // console.log(queryLimit);
    postgreDb.query(query, [token], (err, result) => {
      if (err) {
        console.log(err);
        return reject(new Error("Internal Server Error"));
      }
      postgreDb.query(queryLimit, values, (err, queryresult) => {
        // console.log(queryresult);
        if (err) {
          console.log(err);
          return reject(err);
        }
        // console.log(queryresult);
        // console.log(queryLimit);
        if (queryresult.rows.length == 0) return reject(new Error("History Not Found"));
        let resNext = null;
        let resPrev = null;
        if (queryparams.page && queryparams.limit) {
          let page = parseInt(queryparams.page);
          let limit = parseInt(queryparams.limit);
          let start = (page - 1) * limit;
          let end = page * limit;
          let next = "";
          let prev = "";
          const dataNext = Math.ceil(result.rowCount / limit);
          if (start <= result.rowCount) {
            next = page + 1;
          }
          if (end > 0) {
            prev = page - 1;
          }
          if (parseInt(next) <= parseInt(dataNext)) {
            resNext = `${link}page=${next}&limit=${limit}`;
          }
          if (parseInt(prev) !== 0) {
            resPrev = `${link}page=${prev}&limit=${limit}`;
          }
          let sendResponse = {
            dataCount: result.rowCount,
            next: resNext,
            prev: resPrev,
            totalPage: Math.ceil(result.rowCount / limit),
            data: queryresult.rows,
          };
          // console.log(result);
          return resolve(sendResponse);
        }
        let sendResponse = {
          dataCount: result.rowCount,
          next: resNext,
          prev: resPrev,
          totalPage: null,
          data: queryresult.rows,
        };

        return resolve(sendResponse);
      });
    });
  });
};

const createTransactions = (body, token) => {
  return new Promise((resolve, reject) => {
    const query = "insert into transactions (user_id, product_id, promo_id, qty, shiping, tax, total, payment, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
    const { product_id, promo_id, qty, shiping, tax, total, payment, status } = body;
    // console.log(body);
    postgreDb.query(query, [token, product_id, promo_id, qty, shiping, tax, total, payment, status], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
      // console.log(queryResult);
    });
  });
};

const editTransactions = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update transactions set ";
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
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const deleteTransactions = (params) => {
  return new Promise((resolve, reject) => {
    const query = "delete from transactions where id = $1";
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
const repoTransaction = {
  getTransactions,
  createTransactions,
  editTransactions,
  deleteTransactions,
  historyTransactions,
};

module.exports = repoTransaction;

// =========================================================

// const postgreDb = require("../config/postgre");

// const getTransactions = () => {
//   return new Promise((resolve, reject) => {
//     const query =
//       "select products.product_name, products.price, products.size, products.category, promos.code, promos.discount, accounts.display_name, profiles.address, transactions.quantity, transactions.shipping, transactions.tax, transactions.total, transactions.payment, transactions.status from transactions join products on transactions.product_id = products.id join promos on transactions.promo_id = promos.id join accounts on transactions.account_id = accounts.id";
//     postgreDb.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

// const createTransactions = (body) => {
//   return new Promise((resolve, reject) => {
//     const query = "insert into transactions (account_id, product_id, promo_id, quantity, shipping, tax, total, payment, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
//     // for loop query += ",($5,$6,$7,$8)";
//     const { account_id, product_id, promo_id, quantity, shipping, tax, total, payment, status } = body;
//     postgreDb.query(query, [account_id, product_id, promo_id, quantity, shipping, tax, total, payment, status], (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       resolve(queryResult);
//     });
//   });
// };

// const editTransactions = (body, params) => {
//   return new Promise((resolve, reject) => {
//     let query = "update transactions set ";
//     const values = [];
//     Object.keys(body).forEach((key, idx, array) => {
//       if (idx === array.length - 1) {
//         query += `${key} = $${idx + 1} where id = $${idx + 2}`;
//         values.push(body[key], params.id);
//         return;
//       }
//       query += `${key} = $${idx + 1},`;
//       values.push(body[key]);
//     });
//     postgreDb
//       .query(query, values)
//       .then((response) => {
//         resolve(response);
//       })
//       .catch((err) => {
//         console.log(err);
//         reject(err);
//       });
//   });
// };

// const deleteTransactions = (params) => {
//   return new Promise((resolve, reject) => {
//     const query = "delete from transactions where id = $1";
//     // OR => logika atau sql
//     // "OR" => string OR
//     postgreDb.query(query, [params.id], (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       resolve(result);
//     });
//   });
// };
// const repoTransaction = {
//   getTransactions,
//   createTransactions,
//   editTransactions,
//   deleteTransactions,
// };

// module.exports = repoTransaction;

// module.exports = {
//   getTransaction: (queryParams) => {
//     return new Promise((resolve, reject) => {
//       // const { search, page = 1, limit, filter, sortby, price, transactions } = queryParams;
//       // if (search) {
//       //   query += ` where lower(product_name) like lower('%${queryParams.search}%')`;
//       const { page = 1, limit = 4 } = query;
//       const offset = Number(page - 1) * Number(limit);

//       postgreDb
//         .query("SELECT * FROM transactions ORDER BY id LIMIT $1 OFFSET $2", [Number(limit), offset])
//         .then((result) => {
//           const response = {
//             data: result.rows,
//           };
//           postgreDb
//             .query("SELECT COUNT(*) AS total_transaction FROM transactions")
//             .then((result) => {
//               response.totalData = Number(result.rows[0]["total_transaction"]);
//               response.totalPage = Math.ceil(response.totalData / Number(limit));
//               resolve(response);
//             })
//             .catch((err) => {
//               reject({ status: 500, err });
//             });
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },
//   getSingleTransactionFromServer: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "select * from transactions where id = $1";
//       postgreDb
//         .query(query, [id])
//         .then((data) => {
//           if (data.rows.length === 0) {
//             return reject({ status: 404, err: "Transaction Not Found" });
//           }
//           const response = {
//             data: data.rows,
//           };
//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   createNewTransaction: (body) => {
//     return new Promise((resolve, reject) => {
//       const { payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status } = body;
//       // const id = uuidV4();
//       const query = "INSERT INTO transactions(payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
//       postgreDb
//         .query(query, [payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status])
//         .then(({ rows }) => {
//           const response = {
//             data: rows[0],
//           };
//           resolve(response);
//         })
//         .catch((err) => reject({ status: 500, err }));
//     });
//   },
//   deleteTransaction: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "DELETE FROM transactions where transactions.id = $1";
//       postgreDb
//         .query(query, [id])
//         .then((data) => {
//           const response = {
//             data,
//           };

//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },
//   updateTransaction: (id, body) => {
//     return new Promise((resolve, reject) => {
//       const { payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status } = body;
//       const sqlQuery = "UPDATE transactions SET payment = $1, user_id = $2, tax = $3, payment_id = $4, delivery_id = $5, promo_id = $6, notes = $7, status = $8 WHERE transactions.id = $9";
//       postgreDb
//         .query(sqlQuery, [payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status])
//         .then((data) => {
//           const response = {
//             data,
//           };

//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },
// };
