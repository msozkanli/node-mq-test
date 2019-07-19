const Router = require("express").Router;
const router = new Router();
const rmqRoutes = require("./rmq-routes");





router.use("/rmq",rmqRoutes);

module.exports = router;

