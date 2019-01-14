const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = 'ExternalEvents';

const params = ({ limit = 10, desc = false, startId }) => ({
  TableName: tableName,
  KeyConditionExpression:
    startId === 'init' ? 'keyValue = :keyValue' : 'keyValue = :keyValue and id < :id',
  ScanIndexForward: !desc,
  ExpressionAttributeValues: {
    ':keyValue': 'external',
    ...(startId === 'init' ? {} : { ':id': startId }),
  },
  Limit: limit,
});

const query = params =>
  dynamo.query(params, function(err, data) {
    console.log({ data }, { err });
  });

async function main({ limit, startId = 'init' }) {
  if (startId === '') return { items: [], startId: '' };
  const { Items, LastEvaluatedKey } = await query(params({ desc: true, limit, startId })).promise();
  return { items: Items, startId: LastEvaluatedKey ? LastEvaluatedKey.id : '' };
}

module.exports = main;
