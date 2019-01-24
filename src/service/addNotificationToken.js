const axios = require('axios');
const notification = require('../constants/notification');

async function main(token) {
  const {
    register: { url, params, options },
  } = notification;
  try {
    const res = await axios.post(url(token), params, options);
    return { result: res.statusText };
  } catch (e) {
    console.log(e.toString());
    return { result: e.toString() };
  }
}

module.exports = main;
