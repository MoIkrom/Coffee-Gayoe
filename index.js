const express = require("express");

// import db
const postgreDb = require("./src/config/postgre");
// import mainRouter
const mainRouter = require("./src/routes/main");
// init express application
const server = express();
const PORT = 8080;

postgreDb
  .connect()
  .then(() => {
    // tes connect DB
    console.log("DB connected");
    // parser untuk body
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));
    // extended true  => parsing menggunakan querystring => bisa memproses nested object
    // extended false => parsing menggunakan querystring => tidak bisa memproses nested object

    // semua request ke server akan dikirim ke mainRouter
    server.use(mainRouter);

    // server siap menerima request di port
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
