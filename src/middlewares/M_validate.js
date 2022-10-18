const validate = {};
validate.queryFind = (req, res, next) => {
  const { query } = req;
  const validQuery = Object.keys(query).filter((key) => key === "category" || key === "sort" || key === "order");
  if (validQuery.length < 3) {
    return res.status(400).json({
      err: "Query content must be category, sort, order",
    });
  }
  next();
};

validate.productData = (req, res, next) => {
  const { body } = req;
  console.log(body);
  const validBody = Object.keys(body).filter((key) => key === "product_name" || key === "category" || key === "image" || key === "price");
  console.log(validBody.length);
  if (validBody.length < 4) {
    return res.status(400).json({
      err: "Body content must be product_name, category, image, price",
    });
  }
  next();
};

validate.userData = (req, res, next) => {
  const { body } = req;
  const validBody = Object.keys(body).filter((key) => key === "display_name" || key === "email" || key === "phone_number" || key === "role");
  if (validBody.length < 4) {
    console.log(validBody);
    return res.status(400).json({
      err: "Body content must be display_name, email, phone_number, role",
    });
  }
  next();
};

validate.promotionData = (req, res, next) => {
  const { body } = req;
  const validBody = Object.keys(body).filter((key) => key === "code" || key === "discount");
  if (validBody.length < 3) {
    return res.status(400).json({
      err: "Body content must be code, discount",
    });
  }
  next();
};

validate.transactionData = (req, res, next) => {
  const { body } = req;
  console.log(body);
  const validBody = Object.keys(body).filter((key) => key === "product_id" || key === "quantity" || key === "size" || key === "sub_total" || key === "shipping" || key === "total" || key === "address" || key === "tax");
  if (validBody.length < 8) {
    return res.status(400).json({
      err: "Body content must be  product_id, quantity, size, sub_total, shipping, total, address, dan tax",
    });
  }
  next();
};

validate.searchProduct = (req, res, next) => {
  const { product_name, category_id, sort, order } = req.query;
  if (product_name) {
    if (typeof product_name !== "string") {
      return res.status(400).json({
        error: "Invalid input name!",
      });
    }
  }
  if (category_id) {
    if (category_id !== "1" && category_id !== "2" && category_id !== "3") {
      return res.status(400).json({
        error: "Invalid input category_id!",
      });
    }
  }
  if (sort) {
    if (sort !== "price" && sort !== "input_time" && sort !== "favorites" && sort !== "id") {
      return res.status(400).json({
        error: "Invalid input sort!",
      });
    }
  }
  if (order) {
    if (order !== "asc" && order !== "desc") {
      return res.status(400).json({
        error: "Invalid input order!",
      });
    }
  }
  next();
};

validate.authRegister = (req, res, next) => {
  const { body } = req;
  const validBody = Object.keys(body).filter((key) => key === "email" || key === "password");
  if (validBody.email.value === "" || validBody.email.value.indexOf("@") === -1) {
    return res.status(403).json({
      err: "You Have To Write a Valid Email Address.",
    });
  }
  if (validBody.pass.value === "" || validBody.pass.length >= 8) {
    return res.status(403).json({
      err: "Password Must Be More Than Or Equal To 8 Digits.",
    });
  }
  next();
};

module.exports = validate;

// module.exports = {
//   body: (...allowedKeys) => {
//     return (req, res, next) => {
//       const { body } = req;
//       const sanitizedKey = Object.keys(body).filter((key) => allowedKeys.includes(key));
//       // apakah jumlah key di body sesuai dengan jumlah di allowedKeys
//       const newBody = {};
//       for (let key of sanitizedKey) {
//         Object.assign(newBody, { [key]: body[key] });
//       }
//       // apakah setiap value sesuai dengan tipe data yang diinginkan
//       req.body = newBody;
//       next();
//     };
//   },
// };

// validate.body({title: string}, {author: string})
