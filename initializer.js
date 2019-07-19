const _ = require("lodash");
const argv = require("./config/Yargs");

if (_.includes(argv._[0], "development")) {
    console.log(`Node Env setting ${argv._[0]}`);
    process.env.NODE_ENV = "development";
} else if (_.includes(argv._[0], "prod")) {
    process.env.NODE_ENV = "prod";
}
