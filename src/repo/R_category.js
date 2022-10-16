const postgreDb = require("../config/postgre");

module.exports = {
  showCategory: (queryparams) => {
    return new Promise((resolve, reject) => {
      let query = "select id , category_name, created_at from category";
      if (queryparams.search) {
        query += ` where lower(category_name) like lower('%${queryparams.search}%')`;
      }
      if (queryparams.filtercategory) {
        if (queryparams.search) {
          query += ` and lower(category.category_name::text) like lower('%${queryparams.filtercategory}%')`;
        } else {
          query += ` where lower(category.category_name::text) like lower('%${queryparams.filtercategory}%')`;
        }
      }
      if (queryparams.order == "oldest") {
        query += ` order by created_at desc `;
      }
      if (queryparams.order == "newest") {
        query += ` order by created_at asc `;
      }
      if (queryparams.order == "name") {
        query += ` order by category_name asc `;
      }
      postgreDb.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },
  createCategory: (body) => {
    return new Promise((resolve, reject) => {
      const query = "insert into category (category_name, ) values ($1)";
      const { category_name } = body;
      postgreDb.query(query, [category_name], (err, res) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve("CREATE DATA SUCCESS");
      });
    });
  },
  editCategory: (body, params) => {
    return new Promise((resolve, reject) => {
      let query = "update category set ";
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
  },
  deleteCategory: (params) => {
    return new Promise((resolve, reject) => {
      const query = "delete from category where id = $1";

      postgreDb.query(query, [params.id], (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve("DELETE DATA SUCCESS");
      });
    });
  },
};
