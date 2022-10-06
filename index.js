const express = require("express");

//init express application
const server = express();

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});

// http route
//http://localhost:8080 /
server.get("/", (req, res) => {
  res.json({
    msg: "welcome",
  });
});
