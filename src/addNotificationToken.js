const axios = require('axios');
const notification = require('./constants/notification');

const registerTopic = token =>
  axios.post(notification.registerTopicUrl(token), {}, notification.options).catch(console.log);

async function main(token) {
  const res = await registerTopic(token);
  return { result: res.statusText };
}

module.exports = main;
