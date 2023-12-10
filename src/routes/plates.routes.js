const { Router } = require("express");

const PlatesController = require("../controllers/PlatesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.post("/", ensureAuthenticated, platesController.create);
platesRoutes.put("/:id", ensureAuthenticated, platesController.update);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", ensureAuthenticated, platesController.delete);
platesRoutes.get("/", platesController.index);

module.exports = platesRoutes;