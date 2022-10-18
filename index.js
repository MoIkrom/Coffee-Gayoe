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

// ====================================================

// // // import env
// // require("dotenv").config();
// // // import express
// // const express = require("express");
// // // import db
// // const postgreDb = require("./src/config/postgre");
// // // import mainRouter
// // const mainRouter = require("./src/routes/rt_main");
// // // import morgan
// // const morgan = require("morgan");

// // // init express application
// // const server = express();
// // const PORT = 8080;

// // postgreDb
// //   .connect()
// //   .then(() => {
// //     // tes connect DB
// //     console.log("DB connected");

// //     // init morgan
// //     server.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

// //     // init parser body
// //     server.use(express.json());

// //     server.use(express.urlencoded({ extended: false }));

// //     // mainRouter
// //     server.use(mainRouter);

// //     // run server di port
// //     server.listen(PORT, () => {
// //       console.log(`Server is running at port ${PORT}`);
// //     });
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

// require("dotenv").config();
// const express = require("express");
// // const cors = require("cors");
// //const res = require("express/lib/response");
// //import package express
// const mainRouter = require("./src/routes/rt_main");
// const postgreDb = require("./src/config/postgre");
// //const mainRouter = require("./src/routes");
// const logger = require("morgan");

// //create express app
// const server = express();
// const PORT = 8080;

// //jika db berhasil connect maka jalankan server
// postgreDb
//   .connect()
//   .then(() => {
//     console.log("DB Connected");
//     //pasang router ke server

//     server.use(logger(":method :url :status :res[content-length] - :response-time ms"));

//     server.use(express.urlencoded({ extended: false }));
//     server.use(express.json());

//     //pasang cors
//     // const corsOptions = {
//     //   origin: ["http://127.0.0.1:5500", "http://localhost:3000"],
//     //   methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
//     //   allowed: ["Content-Type", "Authorization"],
//     // };
//     // server.use(cors(corsOptions));

//     server.use(express.static("public"));

//     server.use(mainRouter);

//     //run server at port
//     server.listen(PORT, () => {
//       console.log(`Server is Running at Port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
