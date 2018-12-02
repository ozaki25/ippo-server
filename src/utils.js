const dayjs = require('dayjs');

const formattedDates = ({ target, term }) =>
  [...Array(term)].map((_, i) =>
    dayjs(target)
      .add(i, 'day')
      .format('YYYYMMDD'),
  );

const formattedYearAndMonth = ({ target, term }) =>
  [...Array(term)].map((_, i) =>
    dayjs(target)
      .add(i, 'month')
      .format('YYYYMM'),
  );

module.exports = {
  formattedDates,
  formattedYearAndMonth,
};
