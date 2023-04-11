const postgreDb = require("../config/postgre");

module.exports = {
  getTransactions: () => {
    return new Promise((resolve, reject) => {
      const query =
        "select products.product_name, products.price, products.size, products.category, promos.code, promos.discount, users.username, users.addres, transactions.qty, transactions.shiping, transactions.tax, transactions.total, transactions.payment, transactions.status from transactions join products on transactions.product_id = products.id join promos on transactions.promo_id = promos.id join users on transactions.user_id = users.id";
      postgreDb.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  historyTransactions: (queryparams, token) => {
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
  },

  createTransactions: (body, token) => {
    return new Promise((resolve, reject) => {
      const query = "insert into transactions (user_id, product_id, promo_id, qty, shiping, tax, total, payment, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning * ";
      const { product_id, promo_id, qty, shiping, tax, total, payment, status } = body;
      // console.log(body);
      postgreDb.query(query, [token, product_id, promo_id, qty, shiping, tax, total, payment, status], (err, queryResult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
        // console.log(queryResult.rows[0].id);
      });
    });
  },

  editTransactions: (body, params) => {
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
  },

  deleteTransactions: (params) => {
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
  },
};
