const connpass = require('connpass');
const utils = require('./utils');

async function main() {
  try {
    const options = {
      order: 3,
      count: 100,
      // ymd: utils.formattedDates({ base: new Date(), term: 30 }).join(','),
      // ym: utils.formattedYearAndMonth({ base: new Date(), term: 2 }).join(','),
    };
    return connpass.get(options);
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
