const postgreDb = require("../config/postgre");

module.exports = {
  getProfile: (queryparams) => {
    return new Promise((resolve, reject) => {
      let query = "select account_id , first_name, last_name,display_name_id , address from profiles";
      if (queryparams.search) {
        query += ` where lower(display_name_id) like lower('%${queryparams.search}%')`;
      }
      if (queryparams.filter) {
        if (queryparams.search) {
          query += ` and lower(accounts.role::text) like lower('%${queryparams.filter}%')`;
        } else {
          query += ` where lower(accounts.role::text) like lower('%${queryparams.filter}%')`;
        }
      }
      if (queryparams.order == "oldest") {
        query += ` order by created_at desc `;
      }
      if (queryparams.order == "newest") {
        query += ` order by created_at asc `;
      }
      if (queryparams.order == "name") {
        query += ` order by display_name_id asc `;
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
  // check Email
  check_email: (req) => {
    return new Promise((resolve, reject) => {
      const sqlQuery = "SELECT email FROM public.users WHERE email = $1";
      db.query(sqlQuery, [email])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // Register Account
  CreateProfile: (body) => {
    return new Promise((resolve, reject) => {
      const query = "insert into profiles ( account_id , first_name, last_name, display_name_id , address ) values ($1,$2,$3,$4,$5,) returning id";
      const { account_id, first_name, last_name, display_name_id, address } = body;
      const values = [account_id, first_name, first_name, display_name_id, address];
      postgreDb.query(query, values, (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      });
    });
  },

  editProfile: (body, params) => {
    return new Promise((resolve, reject) => {
      let query = "update accounts set returning id";
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
          resolve(body);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
};
