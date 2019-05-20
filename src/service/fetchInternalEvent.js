const utils = require('../utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'IPPO_InternalEvents';

const params = hashtag => ({
  TableName: tableName,
  KeyConditionExpression: 'hashtag = :hashtag',
  ExpressionAttributeValues: { ':hashtag': hashtag },
  Limit: 1,
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ hashtag }) {
  try {
    const { Items } = await query(params(hashtag)).promise();
    return Items[0];
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
