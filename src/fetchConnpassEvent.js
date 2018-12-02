const connpass = require('connpass');
const utils = require('./utils');

async function main() {
  try {
    const options = {
      order: 2,
      count: 100,
      // ymd: utils.formattedDates({ base: new Date(), term: 30 }).join(','),
      ym: utils.formattedYearAndMonth({ base: new Date(), term: 2 }).join(','),
    };
    const res = await connpass.get(options);
    const { results_returned, results_available, events } = res;
    console.log(results_available);
    console.log(events.length);
    events.forEach(event => console.log(event.title));
    return res;
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
