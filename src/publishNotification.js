const axios = require('axios');
const notification = require('./constants/notification');

async function main() {
  const {
    publish: { url, params, options },
  } = notification;
  const res = await axios.post(url, params, options).catch(console.log);
  return { result: res.statusText };
}

module.exports = main;
