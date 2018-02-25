const yargs = require('yargs');

const config = yargs
  .env('DT')
  .usage('Usage: $0 [options]')
  .option('session-secret', {
    describe: 'Express session secret',
    type: 'string',
  })
  .option('database-url', {
    describe: 'Mongo Database URL',
    type: 'string',
  })
  .group(['session-secret', 'database-url'], 'Server Options:')
  .demandOption(['session-secret'])
  .wrap(Math.min(100, yargs.terminalWidth()))
  .alias('h', 'help')
  .alias('v', 'version').argv;

module.exports = { config };
