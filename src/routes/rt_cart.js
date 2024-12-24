const cartRouter = require("express").Router();
const { addCart } = require("../controllers/C_cart"); 


cartRouter.post("/", addCart); 

module.exports = cartRouter;
