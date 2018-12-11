const axios = require('axios');

const topicName = 'ippo';
const SERVER_KEY = process.env.SERVER_KEY;
const url = 'https://fcm.googleapis.com/fcm/send';

const params = to => ({
  notification: {
    title: '新着イベント',
    body: '新しい勉強会が公開されています',
    click_action: 'http://ippo.netlify.com/#/events/',
    icon: 'https://ippo.netlify.com/icon.png',
  },
  to,
});

const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=${SERVER_KEY}`,
  },
};

const publishTopic = () =>
  axios.post(url, params(`/topics/${topicName}`), options).catch(console.log);

async function main() {
  const res = await publishTopic();
  return { result: res.statusText };
}

module.exports = main;
