const { Pool } = require("pg");
// const { Pool } = pg;

const db = new Pool({
  host: "localhost",
  user: "postgres",
  database: "coffe_gayoe",
  password: "612mikram",
  port: 5432,
});

module.exports = db;
