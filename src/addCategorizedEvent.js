const AWS = require('aws-sdk');
const utils = require('./utils');

const dynamo = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });

const tableName = 'CategorizedEvents';

const params = props => ({
  TableName: tableName,
  Item: {
    keyValue: 'categorized',
    categoryEventId: utils.generateId(),
    ...props,
  },
});

const put = params =>
  dynamo.put(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main(props) {
  try {
    await put(params(props)).promise();
    return { result: 'OK' };
  } catch (e) {
    console.log(e);
    return { result: e.toString() };
  }
}

module.exports = main;
