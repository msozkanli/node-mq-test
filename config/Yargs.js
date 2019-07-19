let yargs = require("yargs");

yargs.command("development", "Development Environment", {
    level: {
        describe: 'Log level',
        demand: false,
        alias: 'l'
    }
}).command('prod', 'Production Environment', {
    level: {
        describe: 'Log level',
        demand: false,
        alias: 'l'
    }
}).help();

module.exports = yargs.argv;
