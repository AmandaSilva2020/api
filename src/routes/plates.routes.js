const { Router } = require("express");

const PlatesController = require("../controllers/PlatesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.use(ensureAuthenticated);

platesRoutes.post("/", verifyUserAuthorization("admin"), platesController.create);
platesRoutes.put("/:id", verifyUserAuthorization("admin"), platesController.update);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", verifyUserAuthorization("admin"), platesController.delete);
platesRoutes.get("/", platesController.index);

module.exports = platesRoutes;