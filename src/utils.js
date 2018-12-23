const dayjs = require('dayjs');
const perf_hooks = require('perf_hooks');

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

const generateId = () => (perf_hooks.performance.now() * 10000000000000).toString();

module.exports = {
  formattedDates,
  formattedYearAndMonth,
  generateId,
};
