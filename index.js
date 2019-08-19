require("./initializer");
require("./config/config");


const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/");
const Logger = require("./middleware/logger/logger.js").Logger;
const ResponseHandler = require("./middleware/ResponseHandler.js");
const ErrorHandler = require("./middleware/error/error-handler");


let app = express();
app.use(bodyParser.raw());


// app.use(bodyParser.urlencoded({extended: true}));

// app.use(express.json());

// app.use("*", function (req, res, next) {
//
//     console.log("------------------------Request Start----------------------");
//
//     let body = '';
//     req.on('data', chunk => {
//         body += chunk.toString(); // convert Buffer to string
//         console.log(body);
//         next();
//     });
//
//     req.on('end', () => {
//         console.log(body);
//         res.end('ok');
//     });
//
//     next();
// });


app.use("/api", routes);

app.use(ErrorHandler);
app.use(ResponseHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT);

console.log(`Application start to listening ${PORT}`);

// RMQService.startWorker();