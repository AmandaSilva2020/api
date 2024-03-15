const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const PlatesController = require("../controllers/PlatesController");
const PlateImageController = require("../controllers/PlateImageController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const platesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const platesController = new PlatesController();
const plateImageController = new PlateImageController();

platesRoutes.use(ensureAuthenticated);

platesRoutes.post("/", verifyUserAuthorization("admin"), platesController.create);
platesRoutes.put("/:id", verifyUserAuthorization("admin"), platesController.update);
platesRoutes.get("/:id", platesController.show);
platesRoutes.delete("/:id", verifyUserAuthorization("admin"), platesController.delete);
platesRoutes.get("/", platesController.index);
platesRoutes.patch("/:id/plateimage", verifyUserAuthorization("admin"), upload.single("plateimage"), plateImageController.update);

module.exports = platesRoutes;