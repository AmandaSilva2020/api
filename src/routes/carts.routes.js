const { Router } = require('express')
const CartsController = require("../controllers/CartsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const cartsRoutes = Router();
const cartsController = new CartsController();

cartsRoutes.post("/" , ensureAuthenticated, cartsController.create);

module.exports  = cartsRoutes;