const utils = require('../utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'Tweets';

const params = tweet => ({
  TableName: tableName,
  Item: { id: utils.generateId(), ...tweet, ...(!tweet.hashtag && { hashtag: 'none' }) },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(tweet) {
  try {
    const response = await put(params(tweet)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
