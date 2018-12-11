const axios = require('axios');

const topicName = 'ippo';
const SERVER_KEY = process.env.SERVER_KEY;

const registerTopicUrl = token =>
  `https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topicName}`;

const options = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `key=${SERVER_KEY}`,
  },
};

const registerTopic = token => axios.post(registerTopicUrl(token), {}, options).catch(console.log);

async function main(token) {
  const res = await registerTopic(token);
  return { result: res.statusText };
}

module.exports = main;
