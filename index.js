// import env
require("dotenv").config();
// import express
const express = require("express");
// import db
const postgreDb = require("./src/config/postgre");
// import mainRouter
const mainRouter = require("./src/routes/rt_main");
// import morgan
const morgan = require("morgan");

// init express application
const server = express();
const PORT = 8080;

postgreDb
  .connect()
  .then(() => {
    // tes connect DB
    console.log("DB connected");

    // init morgan
    server.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

    // init parser body
    server.use(express.json());

    server.use(express.urlencoded({ extended: false }));

    // mainRouter
    server.use(mainRouter);

    // run server di port
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
