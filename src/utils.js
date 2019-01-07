const dayjs = require('dayjs');
const tweet = require('./constants/tweet');

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

const generateId = () => Date.now().toString();

const joinTweet = text => text.includes(tweet.JOIN_WORD);

const leaveTweet = text => text.includes(tweet.LEAVE_WORD);

module.exports = {
  formattedDates,
  formattedYearAndMonth,
  generateId,
  joinTweet,
  leaveTweet,
};
