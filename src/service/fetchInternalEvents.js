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
  // scanしてるのでデータ量増えたらパフォーマンス落ちる懸念有り
  const { Items } = await scan(params).promise();
  const sorted = Items.sort((a, b) => (a.id > b.id ? -1 : 1));
  return { items: limit ? sorted.slice(0, limit) : sorted };
}

module.exports = main;
