const connpass = require('connpass');
const utils = require('./utils');

const TERM = 30;

async function main() {
  try {
    const options = { order: 2, count: 100, ymd: utils.daysFromToday(TERM).join(',') };
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
