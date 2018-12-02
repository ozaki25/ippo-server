const twoDigit = target => `0${target}`.slice(-2);

const formatDate = target => {
  const year = target.getFullYear();
  const month = twoDigit(target.getMonth() + 1);
  const date = twoDigit(target.getDate());
  return `${year}${month}${date}`;
};

const daysAfterToday = day => new Date(Date.now() + day * 86400000 /* 24h */);

const daysFromToday = term => [...Array(term)].map((_, i) => formatDate(daysAfterToday(i)));

module.exports = {
  twoDigit,
  formatDate,
  daysAfterToday,
  daysFromToday,
};
