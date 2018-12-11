const connpass = require('connpass');
const utils = require('./utils');

const options = {
  order: 3,
  count: 30,
  // ymd: utils.formattedDates({ base: new Date(), term: 30 }).join(','),
  // ym: utils.formattedYearAndMonth({ base: new Date(), term: 2 }).join(','),
};

async function main() {
  try {
    return connpass.get(options);
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
