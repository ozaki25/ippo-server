const connpass = require('connpass');
const utils = require('./utils');

async function main() {
  try {
    console.log(utils.daysFromToday(TERM).join(','));
    const options = {
      order: 2,
      count: 100,
      ymd: utils.daysFromToday(new Date(), 30).join(','),
    };
    const res = await connpass.get(options);
    const { results_returned, results_available, events } = res;
    console.log(results_available);
    console.log(events.length);
    events.forEach(event => console.log(event.title));
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
