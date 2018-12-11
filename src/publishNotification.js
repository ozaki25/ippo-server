const axios = require('axios');
const notification = require('./constants/notification');

const publishTopic = () =>
  axios.post(notification.publishUrl, notification.params, notification.options).catch(console.log);

async function main() {
  const res = await publishTopic();
  return { result: res.statusText };
}

module.exports = main;
