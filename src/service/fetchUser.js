const utils = require('../utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'IPPO_Users';

const params = uid => ({
  TableName: tableName,
  KeyConditionExpression: 'uid = :uid',
  ExpressionAttributeValues: { ':uid': uid },
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(uid) {
  try {
    const { Items } = await query(params(uid)).promise();
    return Items[0];
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
