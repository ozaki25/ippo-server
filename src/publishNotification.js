const axios = require('axios');
const getNotificationToken = require('./getNotificationToken');

const SERVER_KEY = process.env.SERVER_KEY;

const url = 'https://fcm.googleapis.com/fcm/send';

const params = token => ({
  notification: {
    title: '新着イベントの通知',
    body: '新しい勉強会が公開されています',
    click_action: 'http://localhost:3000/#/events/',
  },
  to: token,
});

const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=${SERVER_KEY}`,
  },
};

const publish = async ({ token }) => axios.post(url, params(token), options).catch(console.log);

async function main(target) {
  const tokenList = await getNotificationToken(target);
  tokenList.forEach(publish);
}

module.exports = main;
