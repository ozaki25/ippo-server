const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'InternalEvents';

const params = {
  TableName: tableName,
};

const scan = params =>
  dynamo.scan(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ limit }) {
  const { Items } = await scan(params).promise();
  return { items: limit ? Items.slice(0, limit) : Items };
}

module.exports = main;
