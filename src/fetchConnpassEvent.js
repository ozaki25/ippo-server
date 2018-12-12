const connpass = require('connpass');
const utils = require('./utils');

const options = ({ keyword }) => ({
  order: 3,
  count: 10,
  keyword,
  // ymd: utils.formattedDates({ base: new Date(), term: 30 }).join(','),
  // ym: utils.formattedYearAndMonth({ base: new Date(), term: 2 }).join(','),
});

async function main(searchQuery) {
  try {
    console.log({ searchQuery });
    return connpass.get(options({ keyword: searchQuery }));
  } catch (e) {
    console.log(e);
  }
}

module.exports = main;
