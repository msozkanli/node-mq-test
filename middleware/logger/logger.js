let log4js = require("log4js");

log4js.configure({
    appenders: {
        console: {
            type: "console"
        },
        file: {
            type: "file",
            filename: "server.log"
        }
    },
    categories: {
        default: {appenders: ["console", "file"], level: "info"},
        console: {appenders: ["console"], level: "error"},
        file: {appenders: ["file"], level: "error"}
    }
});

let Logger = log4js.getLogger("console");

Logger.level = process.env.LOG_LEVEL;

module.exports = {Logger};
