const searchProduct = (queryparams) => {
  return new Promise((resolve, reject) => {
    let query = "select products.*, promos.code, promos.discount from products full join promos on promos.product_id = products.id ";

    // Search name product
    if (queryparams.search) {
      query += `where lower(product_name) like lower('%${queryparams.search}%')`;
    }

    // Filter category
    if (queryparams.category) {
      if (queryparams.search) {
        query += `and lower(category) = lower('${queryparams.category}')`;
      } else {
        query += `where lower(category) = lower('${queryparams.category}')`;
      }
    }

    if (queryparams.sort == "expensive") {
      query += "order by price asc";
    }
    if (queryparams.sort == "cheapest") {
      query += "order by price desc";
    }
    if (queryparams.sort == "newest") {
      query += "order by created_at desc";
    }
    if (queryparams.sort == "oldest") {
      query += "order by created_at asc";
    }
    if (queryparams.sort == "favorite") {
      query = "select products.* ,transactions.qty from products left join transactions on transactions.product_id = products.id order by transactions.qty desc";
    }

    // const page = Number(queryparams.page);
    // const limit = Number(queryparams.limit);
    // const offset = (page - 1) * limit;
    // query += ` limit ${limit} offset ${offset}`;
    console.log(query);
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
