const postgreDb = require("../config/postgre");

module.exports = {
  getTransaction: (queryParams) => {
    return new Promise((resolve, reject) => {
      // const { search, page = 1, limit, filter, sortby, price, transactions } = queryParams;
      // if (search) {
      //   query += ` where lower(product_name) like lower('%${queryParams.search}%')`;
      const { page = 1, limit = 4 } = query;
      const offset = Number(page - 1) * Number(limit);

      postgreDb
        .query("SELECT * FROM transactions ORDER BY id LIMIT $1 OFFSET $2", [Number(limit), offset])
        .then((result) => {
          const response = {
            data: result.rows,
          };
          postgreDb
            .query("SELECT COUNT(*) AS total_transaction FROM transactions")
            .then((result) => {
              response.totalData = Number(result.rows[0]["total_transaction"]);
              response.totalPage = Math.ceil(response.totalData / Number(limit));
              resolve(response);
            })
            .catch((err) => {
              reject({ status: 500, err });
            });
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },
  getSingleTransactionFromServer: (id) => {
    return new Promise((resolve, reject) => {
      const query = "select * from transactions where id = $1";
      postgreDb
        .query(query, [id])
        .then((data) => {
          if (data.rows.length === 0) {
            return reject({ status: 404, err: "Transaction Not Found" });
          }
          const response = {
            data: data.rows,
          };
          resolve(response);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },

  createNewTransaction: (body) => {
    return new Promise((resolve, reject) => {
      const { payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status } = body;
      // const id = uuidV4();
      const query = "INSERT INTO transactions(payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
      postgreDb
        .query(query, [payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status])
        .then(({ rows }) => {
          const response = {
            data: rows[0],
          };
          resolve(response);
        })
        .catch((err) => reject({ status: 500, err }));
    });
  },
  deleteTransaction: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM transactions where transactions.id = $1";
      postgreDb
        .query(query, [id])
        .then((data) => {
          const response = {
            data,
          };

          resolve(response);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },
  updateTransaction: (id, body) => {
    return new Promise((resolve, reject) => {
      const { payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status } = body;
      const sqlQuery = "UPDATE transactions SET payment = $1, user_id = $2, tax = $3, payment_id = $4, delivery_id = $5, promo_id = $6, notes = $7, status = $8 WHERE transactions.id = $9";
      postgreDb
        .query(sqlQuery, [payment, user_id, tax, payment_id, delivery_id, promo_id, notes, status])
        .then((data) => {
          const response = {
            data,
          };

          resolve(response);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },
};
