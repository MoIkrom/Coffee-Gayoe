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

// const postgreDb = require("../config/postgre");
// // const { v4: uuidV4 } = require("uuid");

// module.exports = {
//   getPromotion: (query) => {
//     return new Promise((resolve, reject) => {
//       const { page = 1, limit = 3 } = query;
//       const offset = Number(page - 1) * Number(limit);

//       postgreDb
//         .query("SELECT * FROM promos ORDER BY id LIMIT $1 OFFSET $2", [Number(limit), offset])
//         .then((result) => {
//           const response = {
//             data: result.rows,
//           };
//           postgreDb
//             .query("SELECT COUNT(*) AS total_promotion FROM promos")
//             .then((result) => {
//               response.totalData = Number(result.rows[0]["total_promo"]);
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
//   getSinglePromotionFromServer: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "select * from promos where id = $1";
//       postgreDb
//         .query(query, [id])
//         .then((data) => {
//           if (data.rows.length === 0) {
//             return reject({ status: 404, err: "Promo Not Found" });
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
//   createNewPromotion: (body, picture) => {
//     return new Promise((resolve, reject) => {
//       const { code, discount } = body;
//       // const id = uuidV4();
//       const query = "INSERT INTO promos(code,discount) VALUES ($1, $2) RETURNING *";
//       postgreDb
//         .query(query, [code, discount])
//         .then(({ rows }) => {
//           const response = {
//             data: rows[0],
//           };
//           resolve(response);
//         })
//         .catch((err) => reject({ status: 500, err }));
//     });
//   },
//   deletePromotion: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "DELETE FROM promos where promos.id = $1";
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
//   updatePromotion: (id, body) => {
//     return new Promise((resolve, reject) => {
//       const { code, discount } = body;
//       const sqlQuery = "UPDATE promos SET promotion_code = $1, detail_promo = $2, discount = $3 WHERE promos.id = $4";
//       postgreDb
//         .query(sqlQuery, [code, discount, id])
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
