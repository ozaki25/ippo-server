const axios = require('axios');
const notification = require('./constants/notification');

async function main(token) {
  const {
    register: { url, params, options },
  } = notification;
  const res = await axios.post(url(token), params, options).catch(console.log);
  return { result: res.statusText };
}

module.exports = main;
