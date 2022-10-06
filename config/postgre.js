const { pool } = require("pg");

const db = new pool({
  host: "localhost",
  user: "ikram",
  database: "postgre",
  password: "mikram",
  port: 5432,
});
