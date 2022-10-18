const postgreDb = require("../config/postgre");

module.exports = {
  getProducts: (queryParams) => {
    return new Promise((resolve, reject) => {
      let link = "http://localhost:8080/api/v1/products/all?";
      const { search, page = 1, limit, filter, price, transactions, order } = queryParams;
      const query = "SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2";

      if (search) {
        query += ` where lower(product_name) like lower('%${search}%')`;
        // link += `search=${search}&`;
      }
      if (order) {
        query += ` where lower(product_name) like lower('%${search}%')`;
        // link += `search=${search}&`;
      }
      if (filter) {
        if (search) {
          query += ` and lower(category_name) like lower('%${filter}%')`;
          // link += `filter=${filter}&`;
        } else {
          query += ` where lower(category_name) like lower ('%${filter}%')`;
          // link += `filter=${queryParams.filter}&`;
        }
      }
      if (order == "newest") {
        query += ` order by created_at desc`;
        // link += `sortby=${sortby}&`;
      }
      if (order == "oldest") {
        query += ` order by created_at asc`;
        // link += `sortby=${sortby}&`;
      }
      if (price == "cheapest") {
        query += ` order by price asc`;
        // link += `price=${price}&`;
      }
      if (price == "pricey") {
        query += ` order by price desc`;
        // link += `price=${price}&`;
      }

      // start Paginasi

      const offset = (Number(page) - 1) * Number(limit);

      postgreDb
        .query(query, [Number(limit), offset])
        .then((result) => {
          const response = {
            data: result.rows,
          };

          //total data
          postgreDb
            .query("SELECT COUNT(*) AS total_product FROM products")
            .then((result) => {
              const next = Number(page) + Number(1);
              const prev = Number(page) - Number(1);
              response.totalData = Number(result.rows[0]["total_product"]);
              response.totalPage = Math.ceil(response.totalData / Number(limit));
              response.currentPage = page;
              response.nextPage = `${link}page=${next}&limit=${limit}`;
              response.prevPage = `${link}page=${prev}&limit=${limit}`;

              resolve(response);
            })
            .catch((err) => {
              console.log(err);
              reject({ status: 500, err });
            });
        })
        .catch((err) => {
          console.log(err);
          reject({ status: 500, err });
        });
    });
  },

  //
  getSingleProductFromServer: (id) => {
    return new Promise((resolve, reject) => {
      const query = "select * from products where id = $1";
      postgreDb
        .query(query, [id])
        .then((data) => {
          if (data.rows.length === 0) {
            return reject({ status: 404, err: "Product Not Found" });
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

  //
  findProduct: (query) => {
    return new Promise((resolve, reject) => {
      const { category, order, sort } = query;
      let sqlQuery = "select * from products where lower(category_id) like lower('%' || $1 || '%')";
      if (order) {
        sqlQuery += " order by " + sort + " " + order;
      }
      postgreDb
        .query(sqlQuery, [category])
        .then((result) => {
          if (result.rows.length === 0) {
            return reject({ status: 404, err: "Product Not Found" });
          }
          const response = {
            total: result.rowCount,
            data: result.rows,
          };
          resolve(response);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },

  //
  searchProduct: (query) => {
    return new Promise((resolve, reject) => {
      const { menu, order, sort } = query;
      let sqlQuery = "SELECT * FROM products WHERE lower(product_name) LIKE lower('%' || $1 || '%')";
      if (order) {
        sqlQuery += " order by " + sort + " " + order;
      }
      postgreDb
        .query(sqlQuery, [menu])
        .then((result) => {
          if (result.rows.length === 0) {
            return reject({ status: 404, err: "Product Not Found" });
          }
          const response = {
            total: result.rowCount,
            data: result.rows,
          };
          resolve(response);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },

  //
  findPromotion: (query) => {
    return new Promise((resolve, reject) => {
      const { code, order, sort } = query;
      let sqlQuery = "select * from promos where lower(code) like lower('%' || $1 || '%')";
      if (order) {
        sqlQuery += " order by " + sort + " " + order;
      }
      postgreDb
        .query(sqlQuery, [code])
        .then((result) => {
          if (result.rows.length === 0) {
            return reject({ status: 404, err: "Promo Not Found" });
          }
          const response = {
            total: result.rowCount,
            data: result.rows,
          };
          resolve(response);
        })
        .catch((err) => {
          reject({ status: 500, err });
        });
    });
  },

  //
  createNewProduct: (body) => {
    return new Promise((resolve, reject) => {
      const { product_name, category, price } = body;
      const query = "INSERT INTO products( product_name, category, price) VALUES ($1, $2, $3) RETURNING *";
      postgreDb
        .query(query, [product_name, category, price])
        .then(({ rows }) => {
          const response = {
            data: rows[0],
          };
          resolve(response);
        })
        .catch((err) => reject({ status: 500, err }));
    });
  },

  //
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM products where products.id = $1";
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

  //
  updateProduct: (id, body) => {
    return new Promise((resolve, reject) => {
      const { product_name, category, price } = body;
      const sqlQuery = "UPDATE products SET product_name = $1, category = $2, price = $3, WHERE products.id = $5";
      postgreDb
        .query(sqlQuery, [product_name, category, price])
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
