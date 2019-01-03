const connpass = require('connpass');
const utils = require('./utils');

const options = ({ keyword, start = 1, count = 10 }) => ({
  order: 3,
  count,
  keyword,
  start,
  // ymd: utils.formattedDates({ base: new Date(), term: 30 }).join(','),
  // ym: utils.formattedYearAndMonth({ base: new Date(), term: 2 }).join(','),
});

async function main({ searchQuery, page, count }) {
  try {
    console.log({ searchQuery, page, count });
    return connpass.get(options({ keyword: searchQuery, start: (page - 1) * count + 1, count }));
  } catch (e) {
    console.log(e.toString());
  }
}

module.exports = main;
