const express = require("express");
const router = express.Router();


const RMQService = require("../service/RMQService");

// router.get('/publish');

router.post("/publish", RMQService.publish);
module.exports = router;
