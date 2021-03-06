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

const generateId = () =>
  [Date.now(), ...process.hrtime()]
    .map((val, i) => (i === 0 ? val : `00000000000${val}`.slice(-9)))
    .join('');

const joinTweet = text => text.includes(tweet.JOIN_WORD);

const leaveTweet = text => text.includes(tweet.LEAVE_WORD);

const detectHashtag = text => {
  const result = text.match(tweet.HASHTAG);
  return result ? result.map(t => t.replace(/#|\s/g, '')) : [];
};

const formatConnpassEvents = events =>
  events
    ? events.map(event => ({
        id: generateId(),
        connpassId: event.event_id,
        title: event.title,
        eventUrl: event.event_url,
        catchMessage: event.catch,
        place: event.place,
        startedAt: event.started_at,
        endedAt: event.ended_at,
      }))
    : [];

module.exports = {
  formattedDates,
  formattedYearAndMonth,
  generateId,
  joinTweet,
  leaveTweet,
  detectHashtag,
  formatConnpassEvents,
};
