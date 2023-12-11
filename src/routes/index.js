const { Router } = require("express");

const usersRouter = require("./users.routes");
const platesRouter = require("./plates.routes");
const sessionsRouter = require("./sessions.routes");
const favoritesRouter = require("./favorites.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/plates", platesRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/favorites", favoritesRouter);

module.exports = routes;