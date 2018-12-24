const utils = require('./utils');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'Users';

const params = user => ({
  TableName: tableName,
  Item: { ...user },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(user) {
  try {
    await put(params(user)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e };
  }
}

module.exports = main;
