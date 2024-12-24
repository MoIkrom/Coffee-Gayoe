require("dotenv").config();

const express = require("express");

const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mainRouter = require("./src/routes/rt_main");
const morgan = require("morgan");
const cors = require("cors");
const server = express();
const PORT = 8080;

server.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

server.use("/images", express.static(path.join(__dirname, "images")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(mainRouter);
server.use("/*", (request, response) => {
  response.status(404).send("Path Not Found");
});
server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
