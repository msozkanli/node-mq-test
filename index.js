require("./initializer");
require("./config/config");


const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/");
const Logger = require("./middleware/logger/logger.js").Logger;
const ResponseHandler = require("./middleware/ResponseHandler.js");
const ErrorHandler = require("./middleware/error/error-handler");

const RMQService = require("./service/RMQService");


let app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use("*", function (req, res, next) {
    Logger.trace(`remoteAddress: [${req.connection.remoteAddress}]  ~ [${req.method}] : [${req.originalUrl}] `);
    next();
});


app.use("/api", routes);

app.use(ErrorHandler);
app.use(ResponseHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT);

console.log(`Application start to listening ${PORT}`);

RMQService.startWorker();