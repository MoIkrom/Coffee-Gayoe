const postgreDb = require("../config/postgre");

const getProduct = (queryparams) => {
  return new Promise((resolve, reject) => {
    let query = "select id , product_name, price, category_id, image, created_at from products";
    if (queryparams.search) {
      query += ` where lower(product_name) like lower('%${queryparams.search}%')`;
    }
    if (queryparams.filtercategory) {
      if (queryparams.search) {
        query += ` and lower(products.categoryproduct::text) like lower('%${queryparams.filtercategory}%')`;
      } else {
        query += ` where lower(products.categoryproduct::text) like lower('%${queryparams.filtercategory}%')`;
      }
    }

    if (queryparams.order == "cheapest") {
      query += ` order by price asc `;
    }
    if (queryparams.order == "priciest") {
      query += ` order by price desc `;
    }
    if (queryparams.order == "oldest") {
      query += ` order by created_at desc `;
    }
    if (queryparams.order == "newest") {
      query += ` order by created_at asc `;
    }
    if (queryparams.order == "name") {
      query += ` order by product_name asc `;
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
const createProduct = (body) => {
  return new Promise((resolve, reject) => {
    const query = "insert into products ( product_name, price, image , category_id) values ($1,$2,$3,$4)";
    const { product_name, price, image, category_id } = body;
    postgreDb.query(query, [product_name, price, image, category_id], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve("CREATE DATA SUCCESS");
    });
  });
};
const editProduct = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
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
      .then(() => {
        resolve("EDIT DATA SUCCESS");
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
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
};
