const axios = require('axios');
const notification = require('./constants/notification');

async function main(token) {
  const {
    unregister: { url, params, options },
  } = notification;
  try {
    console.log(params(token));
    const res = await axios.post(url(token), params(token), options);
    return { result: res.statusText };
  } catch (e) {
    console.log(e.toString());
    return { result: e.toString() };
  }
}

module.exports = main;
