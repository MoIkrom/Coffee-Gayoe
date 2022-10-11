const postgreDb = require("../config/postgre");

const getProduct = (queryparams) => {
  return new Promise((resolve, reject) => {
    let query = `select product_name, priceproduct, categoryproduct, stock from products`;
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
      query += ` order by priceproduct asc `;
    }
    if (queryparams.order == "expensive") {
      query += ` order by priceproduct desc `;
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
    const query = "insert into products ( product_name, priceproduct, categoryproduct, stock) values ($1,$2,$3,$4)";
    const { product_name, priceproduct, categoryproduct, stock } = body;
    postgreDb.query(query, [product_name, priceproduct, categoryproduct, stock], (err, queryResult) => {
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
        query += `${key} = $${idx + 1} where products_id = $${idx + 2}`;
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
    const query = "delete from products where products_id = $1";

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
