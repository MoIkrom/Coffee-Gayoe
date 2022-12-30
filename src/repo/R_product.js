const postgreDb = require("../config/postgre");

const createProduct = (body, file) => {
  return new Promise((resolve, reject) => {
    // let image = null;
    // if (file) {
    //   image = file.secure_url;
    // }
    const query = "insert into products (product_name, price, stock, size, category, image, description) values ($1,$2,$3,$4,$5,$6,$7) returning *";
    const { product_name, price, stock, size, category, description } = body;
    postgreDb.query(query, [product_name, price, stock, size, category, file, description], (err, queryResult) => {
      if (err) {
        console.log(err);

        return reject(err);
      }
      resolve(queryResult);
    });
  });
};

const editProduct = (body, params, file) => {
  return new Promise((resolve, reject) => {
    const { product_name, price, category, description } = body;
    let query = "update products set ";
    const values = [];
    let imageProduct = "";
    let data = {
      id: params.id,
    };

    if (file) {
      imageProduct = file.url;
      if (!product_name && !price && !category && !description) {
        if (file && file.resource_type == "image") {
          query += `image = '${imageProduct}',update_at = now() where id = $1 returning image`;
          values.push(params.id);
          data["image"] = imageProduct;
        }
      } else {
        if (file && file.resource_type == "image") {
          query += `image = '${imageProduct}',`;
          data["image"] = imageProduct;
        }
      }
    }

    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2} returning image`;
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
    const query = "delete from products where id = $1";
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

const searchProduct = (queryparams) => {
  return new Promise((resolve, reject) => {
    let query = "select products.*, promos.code, promos.discount from products full join promos on promos.product_id = products.id ";

    let link = `https://coffee-gayoe.vercel.app/api/v1/product?`;
    let queryLimit = "";

    // console.log(queryparams);
    // Search name product
    if (queryparams.search) {
      query += ` where lower(product_name) like lower('%${queryparams.search}%')`;
      link += `product_name=${queryparams.search}&`;
    }

    // Filter category
    if (queryparams.category) {
      if (queryparams.search) {
        query += `and lower(category) = lower('${queryparams.category}')`;
        link += `category=${queryparams.category}&`;
      } else {
        query += ` where lower(category) = lower('${queryparams.category}')`;
        link += `category=${queryparams.category}&`;
      }
    }

    if (queryparams.sort == "expensive") {
      query += "order by price desc";
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == "name") {
      query += "order by product_name asc";
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == "cheapest") {
      query += "order by price asc";
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == "newest") {
      query += "order by created_at desc";
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == "oldest") {
      query += "order by created_at asc";
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.category == "favorite") {
      query = "select products.* ,transactions.qty from products left join transactions on transactions.product_id = products.id order by transactions.qty desc";
      link += `sort=${queryparams.sort}&`;
    }

    // const page = Number(queryparams.page);
    // const limit = Number(queryparams.limit);
    // const offset = (page - 1) * limit;
    // query += ` limit ${limit} offset ${offset}`;

    // console.log(query);
    let values = [];
    if (queryparams.page && queryparams.limit) {
      let page = parseInt(queryparams.page);
      let limit = parseInt(queryparams.limit);
      let offset = (page - 1) * limit;
      queryLimit = query + ` limit $1 offset $2`;
      values.push(limit, offset);
    } else {
      queryLimit = query;
    }
    // postgreDb.query(query, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     return reject(err);
    //   }
    //   return resolve(result);
    // });
    // console.log(query);
    postgreDb.query(query, (err, result) => {
      postgreDb.query(queryLimit, values, (err, queryresult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        // console.log(queryresult);
        // console.log(queryLimit);
        if (queryresult.rows.length == 0) return reject(new Error("Product Not Found"));
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
          let totalPage = Math.ceil(result.rowCount / limit);
          let meta = {
            dataCount: result.rowCount,
            next: resNext,
            prev: resPrev,
            totalPage: totalPage,
            data: queryresult.rows,
            currentPage: `Page ${page} of ${totalPage} `,
          };
          return resolve(meta);
          // return resolve(queryresult);
        }
        let meta = {
          dataCount: result.rowCount,
          next: resNext,
          prev: resPrev,
          totalPage: null,
          data: queryresult.rows,
        };
        return resolve(meta);
        // return resolve(queryresult);
      });
    });
  });
};

const getid = (params) => {
  return new Promise((resolve, reject) => {
    const query = "select * from products where id = $1";
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// const searchProduct = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     const query = 'select * from product where lower(name_product) like lower($1) order by id_product asc ';
//     const values = [`%${queryParams.name_product}%`];
//     postgreDb.query(query, values, (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(queryResult);
//     });
//   });
// };

// const shorthProduct = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     let query = 'select * from product ';
//     if (queryParams.sort == 'low') {
//       query += 'order by price asc';
//     }
//     if (queryParams.sort == 'high') {
//       query += 'order by price desc';
//     }
//     if (queryParams.sort == 'creat_at_asc') {
//       query += 'order by product asc';
//     }
//     if (queryParams.sort == 'creat_at_desc') {
//       query += 'order by product desc';
//     }
//     if (queryParams.sort == 'favorite') {
//       query = 'select product.*, transactions.quanty from product inner join transactions on transactions.id_product = product.id_product order by transactions.quanty asc';
//     }
//     postgreDb.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

// const filterProduct = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     const query = 'select * from product where lower(category) like lower($1) order by id_product asc ';
//     const values = [`%${queryParams.category}%`];
//     postgreDb.query(query, values, (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(queryResult);
//     });
//   });
// };

const repoProduct = {
  createProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  getid,
  // searchProduct,
  // shorthProduct,
  // filterProduct,
};

module.exports = repoProduct;

// ========================================================

// const postgreDb = require("../config/postgre");

// module.exports = {
//   getProducts: (queryParams) => {
//     return new Promise((resolve, reject) => {
//       let link = "http://localhost:8080/api/v1/products/all?";
//       const { search, page = 1, limit, filter, price, transactions, order } = queryParams;
//       const query = "SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2";

//       if (search) {
//         query += ` where lower(product_name) like lower('%${search}%')`;
//         // link += `search=${search}&`;
//       }
//       if (order) {
//         query += ` where lower(product_name) like lower('%${search}%')`;
//         // link += `search=${search}&`;
//       }
//       if (filter) {
//         if (search) {
//           query += ` and lower(category_name) like lower('%${filter}%')`;
//           // link += `filter=${filter}&`;
//         } else {
//           query += ` where lower(category_name) like lower ('%${filter}%')`;
//           // link += `filter=${queryParams.filter}&`;
//         }
//       }
//       if (order == "newest") {
//         query += ` order by created_at desc`;
//         // link += `sortby=${sortby}&`;
//       }
//       if (order == "oldest") {
//         query += ` order by created_at asc`;
//         // link += `sortby=${sortby}&`;
//       }
//       if (price == "cheapest") {
//         query += ` order by price asc`;
//         // link += `price=${price}&`;
//       }
//       if (price == "pricey") {
//         query += ` order by price desc`;
//         // link += `price=${price}&`;
//       }

//       // start Paginasi

//       const offset = (Number(page) - 1) * Number(limit);

//       postgreDb
//         .query(query, [Number(limit), offset])
//         .then((result) => {
//           const response = {
//             data: result.rows,
//           };

//           //total data
//           postgreDb
//             .query("SELECT COUNT(*) AS total_product FROM products")
//             .then((result) => {
//               const next = Number(page) + Number(1);
//               const prev = Number(page) - Number(1);
//               response.totalData = Number(result.rows[0]["total_product"]);
//               response.totalPage = Math.ceil(response.totalData / Number(limit));
//               response.currentPage = page;

//               if (Number(next)) response.nextPage = `${link}page=${next}&limit=${limit}`;
//               response.prevPage = `${link}page=${prev}&limit=${limit}`;

//               resolve(response);
//             })
//             .catch((err) => {
//               console.log(err);
//               reject({ status: 500, err });
//             });
//         })
//         .catch((err) => {
//           console.log(err);
//           reject({ status: 500, err });
//         });
//     });
//   },

//   //
//   getSingleProductFromServer: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "select * from products where id = $1";
//       postgreDb
//         .query(query, [id])
//         .then((data) => {
//           if (data.rows.length === 0) {
//             return reject({ status: 404, err: "Product Not Found" });
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

//   //
//   findProduct: (query) => {
//     return new Promise((resolve, reject) => {
//       const { category, order, sort } = query;
//       let sqlQuery = "select * from products where lower(category_id) like lower('%' || $1 || '%')";
//       if (order) {
//         sqlQuery += " order by " + sort + " " + order;
//       }
//       postgreDb
//         .query(sqlQuery, [category])
//         .then((result) => {
//           if (result.rows.length === 0) {
//             return reject({ status: 404, err: "Product Not Found" });
//           }
//           const response = {
//             total: result.rowCount,
//             data: result.rows,
//           };
//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   //
//   searchProduct: (query) => {
//     return new Promise((resolve, reject) => {
//       const { menu, order, sort } = query;
//       let sqlQuery = "SELECT * FROM products WHERE lower(product_name) LIKE lower('%' || $1 || '%')";
//       if (order) {
//         sqlQuery += " order by " + sort + " " + order;
//       }
//       postgreDb
//         .query(sqlQuery, [menu])
//         .then((result) => {
//           if (result.rows.length === 0) {
//             return reject({ status: 404, err: "Product Not Found" });
//           }
//           const response = {
//             total: result.rowCount,
//             data: result.rows,
//           };
//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   //
//   findPromotion: (query) => {
//     return new Promise((resolve, reject) => {
//       const { code, order, sort } = query;
//       let sqlQuery = "select * from promos where lower(code) like lower('%' || $1 || '%')";
//       if (order) {
//         sqlQuery += " order by " + sort + " " + order;
//       }
//       postgreDb
//         .query(sqlQuery, [code])
//         .then((result) => {
//           if (result.rows.length === 0) {
//             return reject({ status: 404, err: "Promo Not Found" });
//           }
//           const response = {
//             total: result.rowCount,
//             data: result.rows,
//           };
//           resolve(response);
//         })
//         .catch((err) => {
//           reject({ status: 500, err });
//         });
//     });
//   },

//   //
//   createNewProduct: (body) => {
//     return new Promise((resolve, reject) => {
//       const { product_name, category, price } = body;
//       const query = "INSERT INTO products( product_name, category, price) VALUES ($1, $2, $3) RETURNING *";
//       postgreDb
//         .query(query, [product_name, category, price])
//         .then(({ rows }) => {
//           const response = {
//             data: rows[0],
//           };
//           resolve(response);
//         })
//         .catch((err) => reject({ status: 500, err }));
//     });
//   },

//   //
//   deleteProduct: (id) => {
//     return new Promise((resolve, reject) => {
//       const query = "DELETE FROM products where products.id = $1";
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

//   //
//   updateProduct: (id, body) => {
//     return new Promise((resolve, reject) => {
//       const { product_name, category, price } = body;
//       const sqlQuery = "UPDATE products SET product_name = $1, category = $2, price = $3, image=$4 WHERE products.id = $5";
//       postgreDb
//         .query(sqlQuery, [product_name, category, price, image])
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
