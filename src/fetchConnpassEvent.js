const connpass = require('connpass');
const utils = require('./utils');

const options = {
  order: 3,
  count: 100,
  // ymd: utils.formattedDates({ base: new Date(), term: 30 }).join(','),
  // ym: utils.formattedYearAndMonth({ base: new Date(), term: 2 }).join(','),
};

async function main() {
  return connpass.get(options).catch(console.log);
}

module.exports = main;
