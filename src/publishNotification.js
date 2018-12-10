const getNotificationToken = require('./getNotificationToken');

function main(target) {
  const tokenList = getNotificationToken(target);
  console.log({ tokenList });
}

module.exports = main;
