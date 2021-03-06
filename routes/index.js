const Router = require("express").Router;
const router = new Router();


const FireBaseService = require("../service/FireBaseService");

router.post("/push", FireBaseService.push);
router.post("/token", FireBaseService.addToken);

module.exports = router;

