// const postgreDb = require("../config/postgre");

// const getvoucher = () => {
//   return new Promise((resolve, reject) => {
//     // const query = "select products.product_name , code, valid , discount from promos join products on promos.product_id = products.id";
//     const query = "select * from promos order by created_at desc";
//     postgreDb.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };
// const createvoucher = (body, file) => {
//   return new Promise((resolve, reject) => {
//     const query = "insert into promos ( promo_name, code, valid, discount, description, price, image) values ($1,$2,$3,$4,$5,$6,$7) returning*";
//     const { promo_name, code, valid, discount, description, price } = body;
//     postgreDb.query(query, [promo_name, code, valid, discount, description, price, file], (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       resolve(queryResult);
//     });
//   });
// };
// const editvoucher = (body, params) => {
//   return new Promise((resolve, reject) => {
//     let query = "update promos set ";
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
// const deletevoucher = (params) => {
//   return new Promise((resolve, reject) => {
//     const query = "delete from promos where id = $1";
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
// const searchvoucher = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     // const query = "select * from promos where lower(code) like lower($1) order by id asc ";
//     let query = `select promos.code, promos.discount, products.product_name, products.price, products.category from promos left join products on promos.product_id = products.id `;
//     if (queryParams.code) {
//       query += ` where lower(promos.code) like lower('%${queryParams.code}%')`;
//       // link += `search=${queryParams.search}&`;
//     }
//     console.log(queryParams);
//     postgreDb.query(query, values, (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(queryResult);
//     });
//   });
// };
// const repovoucher = {
//   getvoucher,
//   createvoucher,
//   editvoucher,
//   deletevoucher,
//   searchvoucher,
// };

// module.exports = repovoucher;

// // =========================================================================

// // const postgreDb = require("../config/postgre");

// // const getPromo = (queryparams) => {
// //   return new Promise((resolve, reject) => {
// //     let query = "select id , code, discount , created_at , product_id from promos";
// //     if (queryparams.order == "discount") {
// //       query += ` order by discount desc `;
// //     }

// //     postgreDb.query(query, (err, result) => {
// //       if (err) {
// //         console.log(err);
// //         return reject(err);
// //       }
// //       return resolve(result);
// //     });
// //   });
// // };
// // const createPromo = (body) => {
// //   return new Promise((resolve, reject) => {
// //     const query = "insert into promos (code, discount, product_id) values ($1,$2,$3) ";
// //     const { code, discount, product_id } = body;
// //     postgreDb
// //       .query(query, [code, discount, product_id])
// //       .then(() => {
// //         resolve("Create Data Success");
// //       })
// //       .catch((err) => {
// //         reject(err);
// //       });
// //   });
// // };
// // const editPromo = (body, params) => {
// //   return new Promise((resolve, reject) => {
// //     let query = "update promos set ";
// //     const values = [];

// //     Object.keys(body).forEach((key, idx, array) => {
// //       if (idx === array.length - 1) {
// //         query += `${key} = $${idx + 1} where id = $${idx + 2}`;
// //         values.push(body[key], params.id);
// //         return;
// //       }
// //       query += `${key} = $${idx + 1},`;
// //       values.push(body[key]);
// //     });

// //     postgreDb
// //       .query(query, values)
// //       .then((response) => {
// //         resolve("EDIT DATA SUCCESS : " + values);
// //       })
// //       .catch((err) => {
// //         console.log(err);
// //         reject(err);
// //       });
// //   });
// // };
// // const deletePromo = (params) => {
// //   return new Promise((resolve, reject) => {
// //     const query = "delete from promos where id = $1";

// //     postgreDb
// //       .query(query, [params.id])
// //       .then(() => {
// //         resolve("DELETE DATA SUCCESS");
// //       })
// //       .catch((err) => {
// //         reject(err);
// //       });
// //   });
// // };

// // module.exports = {
// //   getPromo,
// //   createPromo,
// //   editPromo,
// //   deletePromo,
// // };
