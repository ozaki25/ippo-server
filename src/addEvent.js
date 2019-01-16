const AWS = require('aws-sdk');
const utils = require('./utils');
const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'InternalEvents';

const params = event => ({
  TableName: tableName,
  Item: { ...event },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(event) {
  try {
    const id = utils.generateId();
    const timestamp = Date.now();
    const response = await put(params({ ...event, id, timestamp })).promise();
    return { result: 'OK', id };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
