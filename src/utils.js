const dayjs = require('dayjs');

const formattedDates = (date, term) =>
  [...Array(term)].map((_, i) =>
    dayjs(date)
      .add(i, 'day')
      .format('YYYYMMDD'),
  );

module.exports = {
  formattedDates,
};
